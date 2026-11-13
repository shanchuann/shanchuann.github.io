(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const app = document.getElementById('app');
  const canvas = document.querySelector('.design-canvas');
  const frame = document.querySelector('.design-frame');
  const scenes = [...document.querySelectorAll('.scene')];
  const chapters = [...document.querySelectorAll('.chapter-nav a')];
  const device = document.querySelector('.device-position');
  const stage = document.querySelector('.device-stage');
  const caption = document.getElementById('device-caption');
  const layers = [...document.querySelectorAll('.device-image')];
  const splash = document.querySelector('.app-splash');
  const replay = document.querySelector('.replay');
  const progress = document.querySelector('.demo-progress');
  const progressBar = progress.querySelector('i');
  const card = document.querySelector('.demo-card');
  const toast = document.querySelector('.demo-toast');
  const focus = document.querySelector('.demo-focus');
  const cursor = document.querySelector('.demo-cursor');
  const theme = document.querySelector('.theme-button');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const coarse = matchMedia('(hover:none), (pointer:coarse)');
  const config = window.WOOL_LEDGER_CONFIG || {};
  const names = chapters.map(a => a.getAttribute('aria-label'));
  const demoDurations = [1400, 3700, 6500, 4800, 4800, 5800, 4600, 4200, 0];
  let index = 0, scale = 1, width = 1280, height = 832, compact = false, mobile = false;
  let playing = false, transitionUntil = 0, imageLayer = 0, imageRevision = 0;
  let timers = [], animations = [], progressFrame = 0, demoStart = 0, demoDuration = 0;
  let pointerX = -1, pointerY = -1, hover = false;
  let tx = 0, ty = 0, px = 0, py = 0, parallaxFrame = 0;
  let trackingFrame = 0;

  document.querySelectorAll('[data-download]').forEach(a => {
    if (config.downloadUrl) a.href = config.downloadUrl;
    else a.querySelector('strong').textContent = '前往发布页';
  });
  document.querySelectorAll('[data-release]').forEach(a => {
    if (config.releaseUrl) a.href = config.releaseUrl;
    if (config.version) a.firstChild.textContent = `v${config.version} · 发布说明 `;
  });
  ['home','new-entry','statistics','assistant','monthly-receipt','settings'].forEach(name => {
    const img = new Image(); img.src = `assets/${name}.png`;
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
  function animate(el, frames, duration = 450, delay = 0) {
    if (reduced.matches) { Object.assign(el.style,frames[frames.length - 1]); return; }
    animations.push(el.animate(frames,{duration,delay,fill:'forwards',easing:'cubic-bezier(.16,1,.3,1)'}));
  }
  function resetDemo() {
    timers.forEach(clearTimeout); timers = [];
    animations.forEach(a => a.cancel()); animations = [];
    cancelAnimationFrame(progressFrame);
    cursor.classList.remove('pressed');
    [card,toast,focus,cursor].forEach(el => el.removeAttribute('style'));
    card.innerHTML = ''; toast.textContent = '';
    playing = false;
    progress.classList.remove('playing');
    progress.setAttribute('aria-valuenow','0'); progressBar.style.transform = 'scaleX(0)';
  }
  function setCursor(x, y, press = false) {
    const from = cursor.dataset.xy ? JSON.parse(cursor.dataset.xy) : [x + 25,y + 40];
    cursor.dataset.xy = JSON.stringify([x,y]);
    animate(cursor,[{opacity:1,transform:`translate(${from[0]}px,${from[1]}px)`},{opacity:1,transform:`translate(${x}px,${y}px)`}],600);
    if (press) { schedule(600,() => cursor.classList.add('pressed')); schedule(820,() => cursor.classList.remove('pressed')); }
  }
  function highlight(x,y,w,h) {
    Object.assign(focus.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
    animate(focus,[{opacity:0},{opacity:1}],350);
  }
  function showCard(html,top='33%') {
    card.innerHTML = html; card.style.top = top;
    animate(card,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}]);
  }
  function notify(text) {
    toast.textContent = text;
    animate(toast,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],350);
  }
  function finishDemo() {
    playing = false;
    animate(cursor,[{opacity:1},{opacity:0}],200);
    animate(focus,[{opacity:1},{opacity:0}],200);
    scenes[index].classList.add('finished');
    progressBar.style.transform = 'scaleX(1)'; progress.setAttribute('aria-valuenow','100');
    schedule(600,() => progress.classList.remove('playing'));
    placePhone(); positionReplay();
  }
  function progressTick(now) {
    if (!playing || document.hidden) return;
    const p = Math.min(1,(now - demoStart) / demoDuration);
    progressBar.style.transform = `scaleX(${p})`;
    progress.setAttribute('aria-valuenow',String(Math.round(p * 100)));
    if (p < 1) progressFrame = requestAnimationFrame(progressTick);
  }
  function runDemo() {
    resetDemo();
    scenes[index].classList.remove('finished');
    placePhone();
    if (index === 8) return;
    if (reduced.matches) { splash.style.opacity = index === 0 ? '1' : '0'; finishDemo(); return; }
    playing = true; demoDuration = demoDurations[index]; demoStart = performance.now();
    replay.classList.remove('visible');
    if (index > 0) progress.classList.add('playing');
    progressFrame = requestAnimationFrame(progressTick);
    if (index === 0) {
      splash.style.opacity = '1';
      animate(splash.querySelector('img'),[{opacity:0,transform:'scale(.72)',filter:'blur(8px)'},{opacity:1,transform:'scale(1)',filter:'blur(0)'}],1000);
    } else if (index === 1) {
      splash.style.opacity = '1';
      schedule(550,() => { splash.style.opacity = '0'; });
      schedule(1100,() => setCursor(263,166));
      schedule(2000,() => { setCursor(263,166,true); highlight(234,142,42,45); });
      schedule(2900,() => animate(focus,[{opacity:1},{opacity:0}],250));
    } else if (index === 2) {
      splash.style.opacity = '0';
      schedule(500,() => { setCursor(175,320,true); showCard('<strong>一句话记账</strong><div class="demo-input"></div><div class="voice-bars">'+Array.from({length:18},()=>'<i></i>').join('')+'</div><div class="demo-caption">输入示例 · 午饭食堂 15，昨天打车 23</div>'); });
      const text = '午饭食堂 15，昨天打车 23';
      [...text].forEach((c,i) => schedule(1250+i*85,() => { const el=card.querySelector('.demo-input'); if(el)el.textContent+=c; }));
      schedule(3300,() => { showCard('<strong>识别到两笔支出</strong><div class="demo-row"><span>餐饮 · 食堂</span><b>¥15.00</b></div><div class="demo-row"><span>交通 · 打车</span><b>¥23.00</b></div><div class="demo-confirm">确认记录 · ¥38.00</div><div class="demo-caption">网页示例，不写入真实账本</div>'); setCursor(200,520); });
      schedule(4700,() => setCursor(200,520,true));
      schedule(5700,() => notify('已整理 2 笔记录 · 合计 ¥38.00'));
    } else if (index === 3) {
      splash.style.opacity = '0';
      schedule(600,() => { highlight(230,178,42,43); setCursor(251,199,true); });
      schedule(1800,() => { setCursor(205,242); highlight(182,222,45,43); });
      schedule(2900,() => showCard('<strong>周四 · 午间</strong><div class="demo-row"><span>餐饮 · 可乐</span><b>¥3.50</b></div><div class="demo-caption">用时间格子回看每一笔消费</div>','42%'));
      schedule(3900,() => notify('按天、按时段，收支都有迹可循'));
    } else if (index === 4) {
      splash.style.opacity = '0';
      schedule(500,() => setCursor(135,261,true));
      schedule(1500,() => showCard('<strong>这一周，花在哪里？</strong><div class="demo-chart">'+[45,72,38,95,60,80,51].map(h=>`<i style="height:${h}%"></i>`).join('')+'</div><div class="demo-row"><span>餐饮</span><b>¥68.50</b></div><div class="demo-row"><span>交通</span><b>¥23.00</b></div><div class="demo-caption">分类动画示例 · 非真机实时数据</div>','30%'));
      schedule(3100,() => { setCursor(220,456,true); notify('从统计下钻，看清每笔明细'); });
    } else if (index === 5) {
      splash.style.opacity = '0';
      schedule(600,() => { setCursor(150,690,true); showCard('<strong>蓝羊羊</strong><div class="demo-input">这周吃饭花了多少？</div><div class="demo-caption">正在查看示例账目…</div>','42%'); });
      schedule(2300,() => showCard('<strong>这周餐饮支出 ¥68.50</strong><div class="demo-row"><span>食堂 · 午饭</span><b>¥15.00</b></div><div class="demo-row"><span>其余餐饮记录</span><b>¥53.50</b></div><div class="demo-caption">2.0 能力的网页演示 · 未连接你的账本</div>','42%'));
      schedule(4100,() => notify('写账先预览，确认后执行，可撤销'));
    } else if (index === 6) {
      splash.style.opacity = '0';
      schedule(600,() => setCursor(190,185,true));
      schedule(1600,() => showCard('<strong>本月消费小票</strong><div class="demo-row"><span>总支出</span><b>¥221.56</b></div><div class="demo-row"><span>预算</span><b>¥1,200.00</b></div><div class="demo-row"><span>预算使用</span><b>18%</b></div><div class="demo-caption">把生活的细碎，整理成一张小票</div>','34%'));
      schedule(3500,() => notify('日、周、月总结，留住自己的生活节奏'));
    } else {
      splash.style.opacity = '0';
      schedule(600,() => { setCursor(225,385,true); highlight(45,350,310,55); });
      schedule(1700,() => showCard('<strong>按自己的节奏来</strong><div class="demo-row"><span>月度预算</span><b>¥1,200</b></div><div class="demo-row"><span>账期起始日</span><b>每月 1 日</b></div><div class="demo-row"><span>账目保存</span><b>本机</b></div><div class="demo-caption">偏好设置展示 · 可在应用中修改</div>','40%'));
      schedule(3100,() => notify('你的账本，由你自己掌握'));
    }
    schedule(demoDuration,finishDemo);
  }

  async function changeImage(name) {
    const revision = ++imageRevision;
    const next = layers[1-imageLayer];
    next.src = `assets/${name}.png`;
    try { await next.decode(); } catch (_) { return; }
    if (revision !== imageRevision) return;
    next.style.opacity = '1'; layers[imageLayer].style.opacity = '0';
    imageLayer = 1-imageLayer;
    next.alt = `${names[index]}真机界面（v1.54）`;
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
    if (index !== 0 && index !== 8) changeImage(scenes[index].dataset.image);
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
    if(e.target.closest('.detail-track')&&Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
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
    else{splash.style.opacity=index===0?'1':'0';scenes[index].classList.add('finished');placePhone();positionReplay();drawGrain();}
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
