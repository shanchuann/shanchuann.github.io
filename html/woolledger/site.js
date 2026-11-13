(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const canvas = document.querySelector('.design-canvas');
  const frame = document.querySelector('.design-frame');
  const scenes = [...document.querySelectorAll('.scene')];
  const chapters = [...document.querySelectorAll('.chapter-nav a')];
  const device = document.querySelector('.device-position');
  const stage = document.querySelector('.device-stage');
  const caption = document.getElementById('device-caption');
  const layers = [...document.querySelectorAll('.device-image')];
  const video = document.querySelector('.device-recording');
  const replay = document.querySelector('.replay');
  const progress = document.querySelector('.demo-progress');
  const progressBar = progress.querySelector('i');
  const theme = document.querySelector('.theme-button');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const coarse = matchMedia('(hover:none), (pointer:coarse)');
  const config = window.WOOL_LEDGER_CONFIG || {};
  const names = chapters.map(a => a.getAttribute('aria-label'));
  const recordings = [null,'overview','entry','week','statistics','assistant','receipt','preferences',null];
  let index = 0, scale = 1, width = 1280, height = 832, compact = false, mobile = false;
  let playing = false, transitionUntil = 0, imageLayer = 0, imageRevision = 0;
  let timers = [], progressFrame = 0;
  let pointerX = -1, pointerY = -1, hover = false;
  let tx = 0, ty = 0, px = 0, py = 0, parallaxFrame = 0;
  let trackingFrame = 0;
  let playbackRevision = 0;

  document.querySelectorAll('[data-download]').forEach(a => {
    if (config.downloadUrl) a.href = config.downloadUrl;
    else a.querySelector('strong').textContent = '前往发布页';
  });
  document.querySelectorAll('[data-release]').forEach(a => {
    if (config.releaseUrl) a.href = config.releaseUrl;
    if (config.version) a.firstChild.textContent = `v${config.version} · 发布说明 `;
  });
  ['home','new-entry','statistics','assistant','monthly-receipt','settings'].forEach(name => {
    const img = new Image(); img.src = `assets/native/${name}.png`;
  });

  function setTheme(dark) {
    body.classList.toggle('dark', dark);
    theme.setAttribute('aria-pressed', String(dark));
    theme.textContent = dark ? '浅色外观' : '深色外观';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#1c1c1c' : '#c3c3c3';
  }
  let saved;
  try { saved = localStorage.getItem('wool-ledger-site-theme'); } catch (_) {}
  setTheme(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches);
  theme.addEventListener('click', () => {
    const dark = !body.classList.contains('dark'); setTheme(dark);
    try { localStorage.setItem('wool-ledger-site-theme',dark ? 'dark' : 'light'); } catch (_) {}
  });

  function placePhone() {
    let x, y, zoom;
    device.style.transition = reduced.matches ? 'none' : '';
    if (mobile) {
      if (index === 0) { zoom = Math.min(1.1,(width - 35) / 432); y = 452; }
      else {
        const copy = scenes[index].querySelector('.copy');
        const details = scenes[index].querySelector('.details');
        const top = copy ? copy.offsetTop + copy.offsetHeight + 24 : 280;
        const reserve = scenes[index].classList.contains('finished') && details ? details.offsetHeight + 70 : 36;
        zoom = Math.max(.15, Math.min((width - 35) / 432,(height - top - reserve) / 903));
        y = top;
      }
      x = (width - 432 * zoom) / 2;
    } else if (compact) {
      if (index === 0) { zoom = Math.min(width - 40,1000) / 432; x = (width - 432 * zoom) / 2; y = height - 173; }
      else {
        zoom = Math.min((width / 2 - 64) / 432,(height - 100) / 903);
        x = 30 + (width / 2 - 50 - zoom * 432) / 2; y = (height - 903 * zoom) / 2;
      }
    } else {
      zoom = index === 0 ? 1000 / 432 : 700 / 903;
      x = 640 - 216 * zoom; y = index === 0 ? height - 173 : (height - 700) / 2;
    }
    device.style.transform = `translate(${x}px,${y}px) scale(${zoom})`;
    root.style.setProperty('--replay-scale', String(Math.max(.5,scale * zoom)));
    cancelAnimationFrame(trackingFrame);
    const trackingEnd = performance.now() + 1700;
    function trackPhone() {
      positionReplay();
      if (performance.now() < trackingEnd) trackingFrame=requestAnimationFrame(trackPhone);
    }
    trackingFrame=requestAnimationFrame(trackPhone);
  }
  function layout() {
    compact = innerWidth < 940; mobile = innerWidth < 600;
    scale = compact ? 1 : Math.min(innerWidth / 1280,innerHeight / 832);
    width = compact ? innerWidth : innerWidth / scale;
    height = compact ? innerHeight : innerHeight / scale;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    canvas.style.transform = `scale(${scale})`;
    frame.style.left = compact ? '0px' : (width - 1280) / 2 + 'px';
    frame.style.width = compact ? width + 'px' : '1280px';
    root.style.setProperty('--scale',String(scale));
    root.style.setProperty('--compact',String(Math.max(.5,Math.min(1,innerWidth / 940,innerHeight / 900))));
    if (compact && !mobile) {
      const copy = scenes[index].querySelector('.copy');
      root.style.setProperty('--details-top',copy ? copy.offsetTop + copy.offsetHeight + 20 + 'px' : '350px');
    }
    placePhone();
  }

  function schedule(ms, fn) { timers.push(setTimeout(fn, ms)); }
  function resetDemo() {
    playbackRevision++;
    timers.forEach(clearTimeout); timers = [];
    cancelAnimationFrame(progressFrame);
    video.pause();
    video.classList.remove('visible');
    playing = false;
    progress.classList.remove('playing');
    progress.setAttribute('aria-valuenow','0'); progressBar.style.transform = 'scaleX(0)';
  }
  function finishDemo() {
    playing = false;
    scenes[index].classList.add('finished');
    progressBar.style.transform = 'scaleX(1)'; progress.setAttribute('aria-valuenow','100');
    schedule(600,() => progress.classList.remove('playing'));
    placePhone(); positionReplay();
  }
  function progressTick() {
    if (!playing || document.hidden) return;
    const p = Number.isFinite(video.duration) && video.duration > 0 ? Math.min(1,video.currentTime/video.duration) : 0;
    progressBar.style.transform = 'scaleX('+p+')';
    progress.setAttribute('aria-valuenow',String(Math.round(p*100)));
    progressFrame = requestAnimationFrame(progressTick);
  }
  function runDemo() {
    resetDemo();
    scenes[index].classList.remove('finished');
    placePhone();
    if (!recordings[index] || reduced.matches) { finishDemo(); return; }
    playing = true;
    replay.classList.remove('visible');
    const src='assets/native/'+recordings[index]+'.mp4';
    if (video.getAttribute('src') !== src) { video.src=src; video.load(); }
    else video.currentTime=0;
    video.poster='assets/native/'+scenes[index].dataset.image+'.png';
    const revision=playbackRevision;
    video.play().then(() => {
      if (revision!==playbackRevision || !playing) return;
      video.classList.add('visible');
      progress.classList.add('playing');
      progressFrame=requestAnimationFrame(progressTick);
    }).catch(() => { if(revision===playbackRevision)finishDemo(); });
  }
  video.addEventListener('ended',() => { if(playing && video.ended)finishDemo(); });
  video.addEventListener('error',() => { if(playing)finishDemo(); });

  async function changeImage(name) {
    const revision = ++imageRevision;
    const next = layers[1-imageLayer];
    next.src = `assets/native/${name}.png`;
    try { await next.decode(); } catch (_) { return; }
    if (revision !== imageRevision) return;
    next.style.opacity = '1'; layers[imageLayer].style.opacity = '0';
    imageLayer = 1-imageLayer;
    next.alt = `${names[index]}应用实录画面（2.0.1 本地构建）`;
    next.removeAttribute('aria-hidden'); layers[1-imageLayer].alt=''; layers[1-imageLayer].setAttribute('aria-hidden','true');
  }
  function go(target, force = false) {
    target = (target + scenes.length) % scenes.length;
    if (!force && target === index) return;
    const focused = document.activeElement;
    const oldScene = focused?.closest('.scene');
    resetDemo(); index = target;
    transitionUntil = performance.now() + (reduced.matches ? 0 : 850);
    scenes.forEach((scene,i) => {scene.classList.toggle('active',i===index);scene.classList.remove('finished');scene.inert=i!==index;});
    chapters.forEach((a,i) => { if(i===index)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current'); });
    device.classList.toggle('at-title',index===0); device.classList.toggle('at-end',index===8);
    body.classList.toggle('ending',index===8);
    if (index !== 8) changeImage(scenes[index].dataset.image);
    history.replaceState(null,'',`#${scenes[index].id}`);
    document.querySelector('.announcer').textContent = names[index];
    if (oldScene) chapters[index].focus({preventScroll:true});
    scenes[index].querySelectorAll('.detail-track').forEach(t => {t.scrollLeft=0;});
    layout();
    runDemo();
  }
  function step(direction) { if(performance.now()<transitionUntil)return;go(index+direction);flashKey(direction>0?'down':'up'); }
  chapters.forEach((a,i) => a.addEventListener('click',e=>{e.preventDefault();go(i);}));
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();go(0);} );
  document.querySelector('.restart').addEventListener('click',()=>go(0));
  document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();go(0);const h=scenes[0].querySelector('h1');h.tabIndex=-1;h.focus();});
  replay.addEventListener('click',()=>{if(!playing)runDemo();});
  document.querySelectorAll('.detail-pager').forEach(pager => {
    const track=pager.previousElementSibling;
    [...pager.children].forEach((b,i)=>b.addEventListener('click',()=>track.scrollTo({left:i*track.clientWidth,behavior:reduced.matches?'instant':'smooth'})));
    track.addEventListener('scroll',()=>{const n=Math.round(track.scrollLeft/track.clientWidth);[...pager.children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));},{passive:true});
  });
  function flashKey(direction) {
    const el=document.querySelector('.key-'+direction);
    document.querySelectorAll('.key-controls button').forEach(b=>b.classList.remove('on','hit'));
    el.classList.add('on','hit');setTimeout(()=>el.classList.remove('hit'),260);
  }
  document.querySelectorAll('.key-controls button').forEach(b=>b.addEventListener('click',()=>{step(b.classList.contains('key-up')||b.classList.contains('key-left')?-1:1);}));
  document.addEventListener('keydown',e=>{
    if(e.repeat||e.altKey||e.metaKey||e.ctrlKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    const interactive=e.target.closest('button,a');
    if(e.key===' '&&interactive)return;
    if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();step(1);}
    else if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();step(-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);}
    else if(e.key==='End'){e.preventDefault();go(8);}
  });
  let wheelTime=0,wheelTotal=0,wheelLocked=false;
  window.addEventListener('wheel',e=>{
    if(e.ctrlKey)return;
    if(e.target.closest?.('.detail-track')&&Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
    e.preventDefault();
    const now=performance.now();if(now-wheelTime>160){wheelLocked=false;wheelTotal=0;}wheelTime=now;
    if(wheelLocked||now<transitionUntil)return;
    wheelTotal+=e.deltaY;if(Math.abs(wheelTotal)<30)return;
    wheelLocked=true;step(wheelTotal>0?1:-1);wheelTotal=0;
  },{passive:false});
  let touchStart=null;
  window.addEventListener('touchstart',e=>{touchStart=[e.touches[0].clientX,e.touches[0].clientY];},{passive:true});
  window.addEventListener('touchend',e=>{if(!touchStart)return;const dx=touchStart[0]-e.changedTouches[0].clientX,dy=touchStart[1]-e.changedTouches[0].clientY;touchStart=null;if(Math.abs(dy)>40&&Math.abs(dy)>Math.abs(dx)*1.2)step(dy>0?1:-1);},{passive:true});

  function positionReplay() {
    const r=stage.getBoundingClientRect();
    caption.hidden=index===0||index===8;
    caption.style.top=(r.bottom+10)+'px';
    const half=caption.offsetWidth/2;
    caption.style.left=Math.max(half+14,Math.min(innerWidth-half-14,(r.left+r.right)/2))+'px';
    const left=Math.max(0,r.left),right=Math.min(innerWidth,r.right),top=Math.max(0,r.top),bottom=Math.min(innerHeight,r.bottom);
    const inside=pointerX>=left&&pointerX<=right&&pointerY>=top&&pointerY<=bottom&&right>left&&bottom>top;
    hover=!mobile&&inside&&index!==8;
    device.classList.toggle('hovering',hover&&!playing);
    const visible=index>0&&index<8&&!playing&&(mobile||hover||replay.matches(':focus-visible'));
    replay.tabIndex=index>0&&index<8&&!playing?0:-1;
    replay.classList.toggle('visible',visible);
    replay.style.left=(mobile?right+9:(left+right)/2)+'px';
    replay.style.top=(mobile?bottom-40:(top+bottom)/2)+'px';
  }
  function parallaxTick() {
    parallaxFrame=0;
    px+=(tx-px)*.07;py+=(ty-py)*.07;
    canvas.style.setProperty('--left-x',(px*12).toFixed(2));
    canvas.style.setProperty('--center-x',(px*14).toFixed(2));
    canvas.style.setProperty('--right-x',(px*20).toFixed(2));
    canvas.style.setProperty('--move-y',(py*9).toFixed(2));
    positionReplay();
    if(Math.abs(tx-px)>.001||Math.abs(ty-py)>.001)parallaxFrame=requestAnimationFrame(parallaxTick);
  }
  window.addEventListener('pointermove',e=>{
    pointerX=e.clientX;pointerY=e.clientY;
    if(!reduced.matches&&!coarse.matches){tx=(pointerX/innerWidth-.5)*2;ty=(pointerY/innerHeight-.5)*2;if(!parallaxFrame)parallaxFrame=requestAnimationFrame(parallaxTick);}
    positionReplay();
  },{passive:true});
  document.addEventListener('pointerleave',()=>{pointerX=-1;pointerY=-1;tx=ty=0;if(!parallaxFrame)parallaxFrame=requestAnimationFrame(parallaxTick);positionReplay();});
  replay.addEventListener('focus',positionReplay);
  replay.addEventListener('blur',positionReplay);
  device.addEventListener('transitionend',positionReplay);
  reduced.addEventListener('change',()=>{tx=ty=px=py=0;canvas.style.setProperty('--left-x',0);canvas.style.setProperty('--center-x',0);canvas.style.setProperty('--right-x',0);canvas.style.setProperty('--move-y',0);if(reduced.matches){resetDemo();finishDemo();}drawGrain();});
  let resizeFrame=0;
  window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{layout();sizeGrain();});});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){resetDemo();cancelAnimationFrame(parallaxFrame);parallaxFrame=0;}
    else{scenes[index].classList.add('finished');placePhone();positionReplay();drawGrain();}
  });

  const grain=document.getElementById('grain'),ctx=grain.getContext('2d',{alpha:false});
  const tile=document.createElement('canvas');tile.width=256;tile.height=256;
  const tc=tile.getContext('2d',{alpha:false});
  let grainTimer=0;
  function sizeGrain(){grain.width=Math.ceil(innerWidth*Math.min(devicePixelRatio,1.25));grain.height=Math.ceil(innerHeight*Math.min(devicePixelRatio,1.25));drawGrain();}
  function drawGrain(){
    clearTimeout(grainTimer);
    if(!ctx||!tc)return;
    const data=tc.createImageData(256,256),pixels=new Uint32Array(data.data.buffer);
    for(let i=0;i<pixels.length;i++){const n=70+Math.random()*116|0;pixels[i]=(255<<24)|(n<<16)|(n<<8)|n;}
    tc.putImageData(data,0,0);ctx.fillStyle=ctx.createPattern(tile,'repeat');ctx.fillRect(0,0,grain.width,grain.height);
    if(!document.hidden&&!reduced.matches)grainTimer=setTimeout(drawGrain,83);
  }
  const initial=scenes.findIndex(s=>`#${s.id}`===location.hash);
  go(initial>=0?initial:0,true);sizeGrain();
  // Read-only diagnostics used to compare layout and state at each viewport.
  window.WoolLedgerShowcase=Object.freeze({state:()=>({chapter:index+1,id:scenes[index].id,playing,mobile,compact,scale,demoProgress:progress.getAttribute('aria-valuenow')})});
})();
