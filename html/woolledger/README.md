# 羊毛账本官网

独立 HTML/CSS/JavaScript 官网，参照 hole.money 构图和动态交互，使用羊毛账本品牌、界面与功能文案，无前端构建依赖。

## 博客启用

目录为 source/html/woolledger/。博客 _config.yml 已将 html/woolledger/** 加入既有 skip_render，避免套用主题。博客根目录执行 npm run build 后，入口为 public/html/woolledger/index.html。按原有方式发布后访问 /html/woolledger/；导航可链接此路径。本次仅生成文件，不自动发布。

## 交互

- 九章全屏：标题页、原生界面、记账、消费课表、统计、助手、小票、偏好、暗色下载页。
- 同一手机在开场底部以超大尺寸出现，进入功能章后缩至中央；文字模糊淡入，设备画面交叉切换。
- 鼠标移动产生分层阻尼视差；演示结束后悬停手机放大，出现橙色重播按钮。
- 屏幕内网页演示包括输入、确认账目、课表定位、图表、助手问答和小票，上方显示进度。
- 滚轮、方向键、Page Up/Down、空格、Home/End、侧边导航切换章节；移动端上下滑动切章节、左右滑动功能说明，或点分页短线。
- 深浅色、减少动态偏好、键盘焦点、无脚本阅读均有处理。回到后台时停止演示和颗粒刷新。

## 下载配置

config.js 集中配置 version、downloadUrl 和 releaseUrl。当前正式下载为 GitHub v2.0.0 的 WoolLedger-2.0.0-release.apk。downloadUrl 留空时保留发布页入口。旧用户升级包与签名以发布说明为准。

## 素材与真实性

assets/ 的 app-icon.png 与六张手机截图来自应用仓库。截图为 v1.54；网页演示使用示例账目，不写入真实账本，也不是 v2.0 真机运行视频。手机下方保留固定字号说明。2.0 能力文案依据项目 README；以后可补充新版真机截图或录屏。

标题内置 Noto Serif SC 700 字符子集，使用 SIL OFL 1.1；许可和来源在 assets/。修改标题后需补充字体子集。网站无外部字体请求，无第三方脚本、埋点或后台服务。

## 文件

index.html 内容；style.css 布局与材质；site.js 动画状态、输入和移动适配；config.js 下载；scenes.json 章节素材清单；DESIGN.md 与 .impeccable/design.json 记录成品设计规则。
