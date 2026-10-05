/* =========================================================================
   大肥鱼 · 博客宠物
   -------------------------------------------------------------------------
   移植自 DSH 的 dsh-pet 插件，按「只保留动画」处理：

   保留  待机呼吸（循环）· 东张西望（播完翻面）· 随机动作 · 点击回应
   去掉  对话 / 碎碎念 / 余额 / 工作状态 / 系统通知 / 表情包 / 设置页 / 拖拽抛掷物理

   素材 source/pet/*.webm —— VP9 带 alpha，640×360，每段约 10 秒。
   角色在帧里只占 196..434 × 60..330 那一块，所以外面套一层裁切窗只显示这块，
   否则 640×360 的点击热区大得离谱。

   增减动作：改 CFG.actions 的名字，把同名 .webm 丢进 source/pet/ 即可。
   整个关掉：删掉 _config.butterfly.yml 里 inject.bottom 的那一行。
   ========================================================================= */
(function () {
  'use strict'

  var CFG = {
    base: '/pet/',
    size: 340,                 // 视频框宽度 px（角色实际高约 size × 0.42）
    corner: 'bottom-left',     // bottom-left / bottom-right / top-left / top-right
    marginX: 24,
    marginY: 22,
    idle: ['待机呼吸休闲'],
    turn: ['东张西望'],
    clicks: ['点击回应-元气挥手'],
    actions: ['超大伸懒腰', '哈欠连天', '小幅度原地360度旋转展示'],
    // 每次「抽下一个动作」的间隔（秒），到点按下面权重掷一次
    interval: [14, 26],
    weights: { idle: 55, turn: 15, action: 30 },
    preloadDelay: 6000,        // 首屏只加载待机，其余等这么久后再后台预载
    fade: 260
  }

  // 素材帧尺寸与角色实际占据的区域（离线量出来的，六段素材几乎一致）
  var FRAME_W = 640
  var FRAME_H = 360
  var CROP = { x: 176, y: 40, w: 288, h: 312 }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!document.body) return

  var small = window.matchMedia && window.matchMedia('(max-width: 768px)').matches
  var size = Math.round(CFG.size * (small ? 0.7 : 1))
  var S = size / FRAME_W
  var winW = Math.round(CROP.w * S)
  var winH = Math.round(CROP.h * S)
  var boxW = size
  var boxH = Math.round(FRAME_H * S)
  var offX = Math.round(-CROP.x * S)
  var offY = Math.round(-CROP.y * S)

  var place = {
    'bottom-left': 'left:' + CFG.marginX + 'px;bottom:' + CFG.marginY + 'px',
    'bottom-right': 'right:' + CFG.marginX + 'px;bottom:' + CFG.marginY + 'px',
    'top-left': 'left:' + CFG.marginX + 'px;top:' + CFG.marginY + 'px',
    'top-right': 'right:' + CFG.marginX + 'px;top:' + CFG.marginY + 'px'
  }[CFG.corner] || ('left:' + CFG.marginX + 'px;bottom:' + CFG.marginY + 'px')

  var style = document.createElement('style')
  style.textContent =
    '#dsh-pet{position:fixed;' + place + ';width:' + winW + 'px;height:' + winH + 'px;' +
    'overflow:hidden;z-index:40;cursor:pointer;-webkit-tap-highlight-color:transparent;' +
    'opacity:0;transition:opacity .5s ease-out}' +
    '#dsh-pet.ready{opacity:1}' +
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

  var names = {}
  ;[].concat(CFG.idle, CFG.turn, CFG.clicks, CFG.actions).forEach(function (n) { names[n] = true })
  var clips = {}
  var loaded = {}

  Object.keys(names).forEach(function (name) {
    var v = document.createElement('video')
    v.muted = true
    v.playsInline = true
    v.setAttribute('playsinline', '')
    v.setAttribute('muted', '')
    v.preload = 'none'
    v.dataset.name = name
    root.appendChild(v)
    clips[name] = v
  })

  function load(name) {
    var v = clips[name]
    if (!v || loaded[name]) return
    loaded[name] = true
    v.src = CFG.base + encodeURIComponent(name) + '.webm'
    v.preload = 'auto'
    v.load()
  }

  function pick(pool, exclude) {
    var src = pool.length > 1 && exclude ? pool.filter(function (n) { return n !== exclude }) : pool
    if (!src.length) src = pool
    return src[Math.floor(Math.random() * src.length)]
  }

  var current = null
  var facing = 'right'
  var once = false
  var timer = null
  var started = false

  function show(name, isOnce) {
    if (!clips[name]) return
    if (current === name && !isOnce) return
    once = !!isOnce
    var v = clips[name]
    load(name)
    Object.keys(clips).forEach(function (k) {
      if (k !== name) clips[k].classList.remove('on')
    })
    v.classList.toggle('mirror', facing === 'left')
    v.classList.add('on')
    v.loop = !isOnce
    try { v.currentTime = 0 } catch (e) {}
    var p = v.play()
    if (p && p.catch) p.catch(function () {})
    current = name
  }

  function roll() {
    var r = Math.random() * 100
    if (r < CFG.weights.idle) return { kind: 'idle', name: pick(CFG.idle, current), once: false }
    if (r < CFG.weights.idle + CFG.weights.turn) return { kind: 'turn', name: pick(CFG.turn, current), once: true }
    return { kind: 'action', name: pick(CFG.actions, current), once: true }
  }

  function schedule() {
    clearTimeout(timer)
    var sec = CFG.interval[0] + Math.random() * (CFG.interval[1] - CFG.interval[0])
    timer = setTimeout(function () {
      var next = roll()
      show(next.name, next.once)
      if (!next.once) schedule()
    }, sec * 1000)
  }

  Object.keys(clips).forEach(function (name) {
    clips[name].addEventListener('ended', function () {
      if (!once) return
      if (CFG.turn.indexOf(name) !== -1) {
        facing = facing === 'left' ? 'right' : 'left'
        clips[name].classList.toggle('mirror', facing === 'left')
      }
      show(pick(CFG.idle, current), false)
      schedule()
    })
  })

  root.addEventListener('click', function () {
    var name = pick(CFG.clicks, null)
    load(name)
    show(name, true)
    clearTimeout(timer)
  })

  document.addEventListener('visibilitychange', function () {
    if (!started) return
    if (document.hidden) {
      Object.keys(clips).forEach(function (k) { clips[k].pause() })
    } else {
      if (current) { var p = clips[current].play(); if (p && p.catch) p.catch(function () {}) }
    }
  })

  var booted = false
  function boot() {
    if (booted) return
    booted = true
    started = true
    show(pick(CFG.idle, null), false)
    root.classList.add('ready')
    schedule()
    setTimeout(function () {
      Object.keys(names).forEach(load)
    }, CFG.preloadDelay)
  }

  // 不等 window.load —— 首页挂着一堆第三方图，load 可能几十秒都不来。
  // 脚本本身就注入在 </body> 前，DOM 已经就绪，等浏览器空闲即可。
  function afterReady() {
    if (window.requestIdleCallback) window.requestIdleCallback(boot, { timeout: 2500 })
    else setTimeout(boot, 800)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', afterReady, { once: true })
  else afterReady()
  setTimeout(boot, 4500)
})()
