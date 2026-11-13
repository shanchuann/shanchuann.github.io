# 羊毛账本官网

独立 HTML/CSS/JavaScript 官网，参照 hole.money 构图和动态交互，使用羊毛账本品牌、界面与功能文案，无前端构建依赖。

## 博客启用

目录为 source/html/woolledger/。博客 _config.yml 已将 html/woolledger/** 加入既有 skip_render，避免套用主题。博客根目录执行 npm run build 后，入口为 public/html/woolledger/index.html。按原有方式发布后访问 /html/woolledger/；导航可链接此路径。本次仅生成文件，不自动发布。

## 交互

- 九章全屏：标题页、原生界面、记账、消费课表、统计、助手、小票、偏好、暗色下载页。
- 标题页保留底部大手机构图；进入功能章后设备外框固定在中央，换章只替换屏幕内容，文字模糊淡入。不会再出现功能页之间手机边框从里到外的移动动画。
- 鼠标移动产生分层阻尼视差；演示结束后悬停手机，出现橙色重播按钮。
- 手机内部播放应用实录：手动录入并保存、从课表进入“这一格”、浏览统计、Agent 预览确认与查账、生成月度小票和设置操作。视频按 1.5 倍播放，上方进度直接取视频播放时间；悬停重播会从头按同一速度播放。
- 滚轮、方向键、Page Up/Down、空格、Home/End、侧边导航切换章节；移动端上下滑动切章节、左右滑动功能说明，或点分页短线。
- 深浅色、减少动态偏好、键盘焦点、无脚本阅读均有处理。回到后台时停止演示和颗粒刷新。

## 下载配置

config.js 集中配置 version、downloadUrl 和 releaseUrl。当前正式下载为 GitHub v2.0.0 的 WoolLedger-2.0.0-release.apk。downloadUrl 留空时保留发布页入口。旧用户升级包与签名以发布说明为准。

## 素材与真实性

当前展示素材在 assets/native/：独立 Android 35 模拟器运行本地 2.0.1 debug APK，录制七段真实操作及静态封面。使用应用种子演示账目；录入、确认、统计和反馈全部由应用执行。官网不再绘制应用内弹窗、图表、聊天回复或提示条。外框使用独立透明 PNG；静态画面和视频 poster 均使用不带边框的原始屏幕截图。录像解码首帧后才显示，避免加载时套出第二层边框。不重画应用 UI。固定图注标明“应用实录 · 2.0.1 本地构建 · 演示账本”。素材明细、文件哈希和源码流程对应关系见 assets/native/PROVENANCE.md。正式 APK 下载版本仍由 config.js 独立维护。

标题内置 Noto Serif SC 700 字符子集，使用 SIL OFL 1.1；许可和来源在 assets/。修改标题后需补充字体子集。网站无外部字体请求，无第三方脚本、埋点或后台服务。

## 文件

index.html 内容；style.css 布局与材质；site.js 动画状态、输入和移动适配；config.js 下载；scenes.json 章节素材清单；DESIGN.md 与 .impeccable/design.json 记录成品设计规则。
