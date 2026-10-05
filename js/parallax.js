/* =========================================================================
   背景视差 —— 站点背景随滚动轻微上移（最多 4vh），读起来像是被从下往上
   "拉"进视野。配合 custom.css 里 #web_bg 的 top:-4vh / height:108vh，
   以及头图底部那层渐变遮罩，头图与背景之间的衔接不再是一条硬边。
   不想要这个效果：删掉 _config.butterfly.yml 里 inject.bottom 那一行即可。
   ========================================================================= */
(function () {
  var bg = document.getElementById('web_bg')
  if (!bg) return
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  var limit = function () { return window.innerHeight * 0.04 }
  var ticking = false

  function update () {
    ticking = false
    var y = Math.min(window.scrollY * 0.05, limit())
    bg.style.transform = 'translate3d(0,' + (-y).toFixed(2) + 'px,0)'
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true
      window.requestAnimationFrame(update)
    }
  }, { passive: true })

  update()
})()
