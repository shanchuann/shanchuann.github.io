/* =========================================================================
   大肥鱼 · 博客宠物
   -------------------------------------------------------------------------
   移植自 DSH 的 dsh-pet 插件，只保留动画：待机 / 东张西望（播完翻面）/
   走动 / 随机动作 / 点击回应。不含对话、碎碎念、余额、工作状态、系统通知、
   表情包、设置页、拖拽抛掷物理。

   素材 source/pet/*.webm —— VP9 带 alpha，640×360，每段约 10 秒，共 106 段。
   离线量过全部 106 段：角色出现在 x 180..459、y 48..330 之间，而且**每一段
   的最低像素都落在 y=330**（那就是地面线）。所以：
     · 外面套一层裁切窗，只显示角色那一块，点击热区才不会大得离谱；
     · 裁切窗下沿卡在 y=332，贴着地面线 —— 宠物是真的踩在屏幕底边上，
       不是浮在半空。

   想增减动作：往 source/pet/ 丢同名 .webm，再改下面的池子。
   整个关掉：删掉 _config.butterfly.yml 里 inject.bottom 的那一行。
   ========================================================================= */
(function () {
  'use strict'

  var CFG = {
    base: '/pet/',
    size: 340,                 // 视频框宽度 px（角色实际高约 size × 0.44）
    corner: 'bottom-left',     // bottom-left / bottom-right
    marginX: 24,
    marginY: 0,                // 0 = 脚踩在视口底边上
    interval: [12, 24],        // 每轮掷动作的间隔（秒）
    weights: { idle: 45, turn: 10, move: 10, action: 35 },
    fade: 240,
    loadTimeout: 2500          // 按需加载最多等多久，超时就先不播
  }

  var FRAME_W = 640
  var FRAME_H = 360
  var CROP = { x: 176, y: 40, w: 288, h: 292 }   // 下沿 332 = 地面线 330 + 2

  var ANIMS = {
    idle: ['待机呼吸休闲'],
    turn: ['东张西望'],
    clicks: ['点击回应-开心跃动', '点击回应-害羞惊讶', '点击回应-傲娇生气', '点击回应-挠痒咯咯笑', '点击回应-元气挥手'],
    moves: [
      { name: '螃蟹走路' },
      { name: '原地漂浮踏步', minDist: 40, maxDist: 120 },
      { name: '原地左转奔跑', minDist: 120, maxDist: 320, leadSec: 1.75, tailSec: 4.8 }
    ],
    moveDefault: { minDist: 60, maxDist: 240, margin: 20, leadSec: 2, tailSec: 2 },
    // 随机动作分类池，权重照搬原配置
    categories: [
      { id: '小动作', weight: 20, actions: ['悠闲哼歌', '超大伸懒腰', '原地敲击桌面互动', '原地重力下蹲压缩', '哈欠连天', '原地小憩沉眠', '女仆屈膝礼仪', '被吓一跳', '小幅度原地360度旋转展示', '偷吃零食被抓住', '用鲸鱼尾巴拍打地面', '打瞌睡被惊醒', '照镜子', '整体换装试色', '轻快记录', '写代码', '摇扇纳凉', '晨间刷牙'] },
      { id: '玩耍', weight: 20, actions: ['原地专心玩魔方', '原地蹲下玩玩具汽车', '鲸鱼吐泡泡特效', '原地跳跃抓碎头顶物品', '玩游戏气急败坏', '玩水枪', '小提琴演奏', '蓝鲸现世', '优雅女仆舞', '轻快摇摆舞', '可爱宅舞', '吹气球', '动物环绕', '放风筝', '拆礼物', '变鸽子', '扑克魔术', '抽陀螺', '吹笛子', '蝴蝶蜜蜂环绕头顶开花', '撸猫', '凭空生花', '骑木马', '三球抛接', '踢毽子', '下五子棋', '荡秋千'] },
      { id: '吃什么', weight: 16, actions: ['吃白饭', '大口吃零食', '吃Token', '吃早餐', '吃午餐', '吃晚餐', '吃冰淇淋融化', '吃大闸蟹', '吃糖葫芦', '吃长寿面', '吃西瓜', '涮火锅'] },
      { id: '时节', weight: 14, actions: ['被落叶淹没', '中秋赏月吃月饼', '堆雪人', '放烟花', '吃粽子', '吃年糕', '吃青团', '吃腊八粥', '吃重阳糕', '收红包', '写福字', '穿针乞巧', '舞狮头', '讨糖南瓜灯', '插茱萸赏菊', '放河灯', '萌化小幽灵', '装点圣诞树', '放孔明灯', '吃汤圆', '吃饺子'] },
      { id: '文字', weight: 10, actions: ['是啊，吃什么', '深度思考碎碎念'] }
    ],
    // 原插件里由余额 / 碎碎念 / 工作状态事件触发的那几段，博客上没有对应事件，
    // 就当普通随机动作一起抽，免得素材白放着。
    extras: ['碎碎念-擦桌碎碎念', '碎碎念-发呆碎碎念', '碎碎念-对屏碎碎念', '被鼠标拖拽悬空反馈',
      '余额-钱袋满溢', '余额-金袋叮当', '余额-钱袋如常', '余额-数金皱眉', '余额-袋空如洗', '余额-分文不剩',
      '工作状态-思考冒泡', '工作状态-忙碌点按', '工作状态-清点归档', '工作状态-原地踱步张望', '工作状态-雀跃庆祝', '工作状态-垂头叹气冒汗']
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!document.body) return

  var small = window.matchMedia && window.matchMedia('(max-width: 768px)').matches
  var size = Math.round(CFG.size * (small ? 0.68 : 1))
  var S = size / FRAME_W
  var boxW = size
  var boxH = Math.round(FRAME_H * S)
  var winW = Math.round(CROP.w * S)
  var winH = Math.round(CROP.h * S)
  var offX = Math.round(-CROP.x * S)
  var offY = Math.round(-CROP.y * S)

  var style = document.createElement('style')
  style.textContent =
    '#dsh-pet{position:fixed;bottom:' + CFG.marginY + 'px;width:' + winW + 'px;height:' + winH + 'px;' +
    'overflow:hidden;z-index:40;cursor:pointer;-webkit-tap-highlight-color:transparent;' +
    'opacity:0;transition:opacity .5s ease-out}' +
    '#dsh-pet.ready{opacity:1}' +
    '#dsh-pet.moving{transition:opacity .5s ease-out,left var(--pet-move,0s) linear}' +
    '#dsh-pet video{position:absolute;left:' + offX + 'px;top:' + offY + 'px;' +
    'width:' + boxW + 'px;height:' + boxH + 'px;opacity:0;transition:opacity ' + CFG.fade + 'ms linear;' +
    'pointer-events:none;transform-origin:50% 50%}' +
    '#dsh-pet video.on{opacity:1}' +
    '#dsh-pet video.mirror{transform:scaleX(-1)}' +
    '@media (prefers-reduced-motion: reduce){#dsh-pet{display:none}}'
  document.head.appendChild(style)

  var root = document.createElement('div')
  root.id = 'dsh-pet'
  root.setAttribute('aria-hidden', 'true')
  document.body.appendChild(root)

  var clips = {}
  var loaded = {}
  var current = null
  var facing = 'right'
  var once = false
  var timer = null
  var booted = false
  var busy = false

  function el(name) {
    if (clips[name]) return clips[name]
    var v = document.createElement('video')
    v.muted = true
    v.playsInline = true
    v.setAttribute('playsinline', '')
    v.setAttribute('muted', '')
    v.preload = 'none'
    v.dataset.name = name
    v.addEventListener('ended', function () { onEnded(name) })
    root.appendChild(v)
    clips[name] = v
    return v
  }

  function load(name) {
    var v = el(name)
    if (loaded[name]) return v
    loaded[name] = true
    v.src = CFG.base + encodeURIComponent(name) + '.webm'
    v.preload = 'auto'
    v.load()
    return v
  }

  // 按需加载：没有就现拉，最多等 CFG.loadTimeout；等不到就先不播（保持原样）
  function ensure(name, cb) {
    var v = el(name)
    if (loaded[name] && v.readyState >= 3) return cb(true)
    load(name)
    var done = false
    var fin = function (ok) { if (done) return; done = true; clearTimeout(t); v.removeEventListener('canplay', on); cb(ok) }
    var on = function () { fin(true) }
    var t = setTimeout(function () { fin(v.readyState >= 3) }, CFG.loadTimeout)
    v.addEventListener('canplay', on)
  }

  function pick(pool, exclude) {
    var src = pool.length > 1 && exclude ? pool.filter(function (n) { return n !== exclude }) : pool
    if (!src.length) src = pool
    return src[Math.floor(Math.random() * src.length)]
  }

  function pickCategory() {
    var total = 0, i
    for (i = 0; i < ANIMS.categories.length; i++) total += ANIMS.categories[i].weight
    var t = Math.random() * total
    for (i = 0; i < ANIMS.categories.length; i++) {
      t -= ANIMS.categories[i].weight
      if (t <= 0) return ANIMS.categories[i]
    }
    return ANIMS.categories[ANIMS.categories.length - 1]
  }

  function pickAction() {
    if (Math.random() < 0.06) return pick(ANIMS.extras, current)
    return pick(pickCategory().actions, current)
  }

  function posX() { return parseFloat(root.style.left || '0') }
  function bounds() {
    var maxX = window.innerWidth - winW - ANIMS.moveDefault.margin
    return { min: ANIMS.moveDefault.margin, max: Math.max(ANIMS.moveDefault.margin, maxX) }
  }
  function place(x) {
    var b = bounds()
    root.style.left = Math.max(b.min, Math.min(b.max, x)) + 'px'
  }

  function show(name, isOnce, cb) {
    if (!ANIMS.idle.concat(ANIMS.turn).length) return
    if (current === name && !isOnce) { if (cb) cb(); return }
    ensure(name, function (ok) {
      if (!ok) { if (cb) cb(false); return }
      var v = clips[name]
      once = !!isOnce
      Object.keys(clips).forEach(function (k) { if (k !== name) clips[k].classList.remove('on') })
      v.classList.toggle('mirror', facing === 'left')
      v.classList.add('on')
      v.loop = !isOnce
      try { v.currentTime = 0 } catch (e) {}
      var p = v.play()
      if (p && p.catch) p.catch(function () {})
      current = name
      if (cb) cb(true)
    })
  }

  // ---------------- 走动：把宠物沿地面平移一段 ----------------
  var moveToken = 0
  function tryMove() {
    var act = pick(ANIMS.moves, null)
    var d = ANIMS.moveDefault
    var minD = act.minDist != null ? act.minDist : d.minDist
    var maxD = act.maxDist != null ? act.maxDist : d.maxDist
    var lead = act.leadSec != null ? act.leadSec : d.leadSec
    var tail = act.tailSec != null ? act.tailSec : d.tailSec
    var dist = (minD + Math.random() * (maxD - minD)) * (size / 462)
    var dir = facing === 'right' ? 1 : -1
    var b = bounds()
    var target = posX() + dir * dist
    if (target > b.max || target < b.min) {
      facing = facing === 'left' ? 'right' : 'left'
      dir = -dir
      target = Math.max(b.min, Math.min(b.max, posX() + dir * dist))
      if (Math.abs(target - posX()) < 10) return null
    }
    return { name: act.name, target: target, lead: lead, tail: tail }
  }

  function runMove(mv, v) {
    var token = ++moveToken
    var dur = (v.duration || 10) - mv.lead - mv.tail
    if (!(dur > 0.5)) dur = 4
    root.classList.add('moving')
    root.style.setProperty('--pet-move', dur + 's')
    setTimeout(function () {
      if (token !== moveToken) return
      place(mv.target)
    }, mv.lead * 1000)
    setTimeout(function () {
      if (token !== moveToken) return
      root.classList.remove('moving')
      root.style.setProperty('--pet-move', '0s')
    }, (mv.lead + dur) * 1000)
  }

  // ---------------- 调度 ----------------
  function schedule() {
    clearTimeout(timer)
    var sec = CFG.interval[0] + Math.random() * (CFG.interval[1] - CFG.interval[0])
    timer = setTimeout(rollNext, sec * 1000)
  }

  function rollNext() {
    if (busy) { schedule(); return }
    var r = Math.random() * 100
    var w = CFG.weights
    if (r < w.idle) {
      show(pick(ANIMS.idle, current), false)
      schedule()
      return
    }
    if (r < w.idle + w.turn) {
      show(pick(ANIMS.turn, current), true)
      return
    }
    if (r < w.idle + w.turn + w.move) {
      var mv = tryMove()
      if (mv) {
        busy = true
        ensure(mv.name, function (ok) {
          busy = false
          if (!ok) { schedule(); return }
          var v = clips[mv.name]
          show(mv.name, true, function (shown) {
            if (!shown) { schedule(); return }
            runMove(mv, v)
          })
        })
        return
      }
    }
    show(pickAction(), true)
  }

  function onEnded(name) {
    if (!once || name !== current) return
    if (ANIMS.turn.indexOf(name) !== -1) {
      facing = facing === 'left' ? 'right' : 'left'
      clips[name].classList.toggle('mirror', facing === 'left')
    }
    show(pick(ANIMS.idle, current), false)
    schedule()
  }

  // ---------------- 点击回应 ----------------
  root.addEventListener('click', function () {
    var name = pick(ANIMS.clicks, null)
    clearTimeout(timer)
    show(name, true, function (ok) { if (!ok) schedule() })
  })

  document.addEventListener('visibilitychange', function () {
    if (!booted) return
    if (document.hidden) {
      Object.keys(clips).forEach(function (k) { clips[k].pause() })
    } else if (current && clips[current]) {
      var p = clips[current].play()
      if (p && p.catch) p.catch(function () {})
    }
  })

  window.addEventListener('resize', function () { place(posX()) })

  function boot() {
    if (booted) return
    booted = true
    place(CFG.corner === 'bottom-right' ? window.innerWidth - winW - CFG.marginX : CFG.marginX)
    show(pick(ANIMS.idle, null), false, function () {
      root.classList.add('ready')
      schedule()
    })
  }

  // 不等 window.load —— 首页挂着一堆第三方图，load 可能几十秒都不来
  function afterReady() {
    if (window.requestIdleCallback) window.requestIdleCallback(boot, { timeout: 2500 })
    else setTimeout(boot, 800)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterReady, { once: true })
  else afterReady()
  setTimeout(boot, 4500)
})()
