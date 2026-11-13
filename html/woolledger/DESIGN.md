---
name: 羊毛账本官网
description: 灰色颗粒环境中的全屏产品叙事、共享 Android 设备与橙色重播。
colors:
  paper: "#c3c3c3"
  ink: "#1c1c1c"
  muted: "#414141"
  accent: "#dc4523"
  tag: "#d0d0d0"
  dark-muted: "#b6b6b6"
  dark-accent: "#f38066"
  dark-tag: "#2d2d2d"
  closing-muted: "#aaa"
  underline: "#414cf4"
typography:
  display:
    fontFamily: '"Wool Serif", "Source Han Serif SC", "Songti SC", STSong, SimSun, serif'
    fontSize: "120px"
    fontWeight: 700
    lineHeight: "130px"
    letterSpacing: "-.015em"
  headline:
    fontFamily: '"Wool Serif", "Source Han Serif SC", "Songti SC", STSong, SimSun, serif'
    fontSize: "60px"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-.02em"
  title:
    fontFamily: '"Wool Serif", "Source Han Serif SC", "Songti SC", STSong, SimSun, serif'
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-.01em"
  intro:
    fontFamily: '"Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "22px"
    lineHeight: "32px"
  body:
    fontFamily: '"Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "16px"
    lineHeight: "24px"
  label:
    fontSize: "11px"
    lineHeight: "16px"
rounded:
  button: "8px"
  app-mark: "10px"
  opening-mark: "16px"
  pill: "30px"
  circle: "50%"
spacing:
  copy-gap: "16px"
  opening-gap: "22px"
  feature-gap: "36px"
  header-inset: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    padding: "9px 12px"
    width: "156px"
  replay:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    rounded: "{rounded.circle}"
  tag:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
---

# Design System: 羊毛账本官网

## Overview

**Creative North Star: "灰幕上的随身账本"**

中性颗粒灰幕、粗重中文衬线与一台持续存在的 Android 设备构成产品舞台。此系统仅适用于 `source/html/woolledger/` 官网，依据当前 `style.css`、`site.js` 和 `index.html` 记录；不约束博客全局或 Android 原生应用。

用户指定的 Money Hole 构图和交互权威落实为九章全屏叙事、共享设备缩放、阻尼视差、橙色重播和手机内应用操作实录。桌面、平板、手机共享章节状态而采用不同空间安排；手机也使用全屏章节和横向说明轮播。七段录像与静态封面来自 Android API 35 模拟器上的 2.0.1 本地 debug 构建，使用演示账本。正式下载仍独立指向 2.0.0，不混淆录像和发布版本。

**Key Characteristics:**
- 中性灰与墨色反转，橙色标记交互状态。
- 自托管中文衬线大标题与无衬线说明。
- 持久设备、分层视差与可重播的应用实录。
- 全屏章节导航及移动端完成后出现的功能轮播。

## Colors

灰阶决定环境，橙色决定进度、当前章节、重播与焦点。开场副文案保留一条独立蓝色手绘感划线，该颜色不承担章节状态角色。

### Primary
- **动作橙（accent）**：重播、顶部播放进度、选中短线和焦点。
- **夜间浅橙（dark-accent）**：独立深色主题中的同等角色。

### Secondary
- **划线蓝（underline）**：仅用于开场副文案底线，不推广为状态色。

### Neutral
- **舞台灰（paper）与墨色（ink）**：背景、正文、按钮前景和底色相互反转。
- **说明灰（muted / dark-muted / closing-muted）**：环境中的次级文字。
- **标签灰（tag / dark-tag）**：功能标签背景。

**The Ambient Theme Rule.** 外观切换改变环境变量，产品截图保持原始颜色；结尾独立进入暗色环境。

## Typography

**Display Font:** 自托管 Wool Serif，即 Noto Serif SC 700 标题字符子集；后备为 Source Han Serif SC、Songti SC、STSong、SimSun、serif。
**Body Font:** Helvetica Neue、PingFang SC、Microsoft YaHei、sans-serif。

标题字库位于 `assets/noto-serif-sc-700.ttf`（44,556 bytes），通过 font-display:swap 加载；当前字符子集之外的新文案可能使用后备字形，扩展标题时需同步检查覆盖。

### Hierarchy
- **Display**：开场双行标题使用 display token；平板为 90px / 1.15，手机为 68px / 1.2、字距 -.025em。
- **Headline**：功能章节使用 headline token；手机为 29px / 38px、字距 0，两行标记变为同行文本。
- **Title**：功能说明使用 title token；手机为 17px / 26px。
- **Intro**：功能导语使用 intro token；开场为 24px / 28px。手机功能导语为 16px / 24px，开场为 12px / 16px。
- **Body**：功能段落使用 body token；手机为 12px / 18px。
- **Label**：页头、设备外固定真实性图注等使用 11px 级文字；图注固定为 label token，不随设备缩放。

**The Two Voices Rule.** 标题使用自托管衬线字形，说明与操作使用无衬线；录屏内部字形直接来自应用，不由网页重绘。

## Layout

整个页面为固定视口舞台，html/body 隐藏溢出。桌面使用 1280×832 设计坐标，比例为 min(视口宽/1280,视口高/832)，画布高度随视口映射，1280px 内容框水平居中。九章绝对定位，只有当前章节可见并可交互，其他章节 inert。

开场文案在宽 1280px、高度减 173px 的区域居中，下方设备宽 1000 设计像素，顶部位于画布高度减 173px。功能章节左文案起点 60px、宽 376px，右说明起点 844px、宽 376px；设备居中、高 700 设计像素。页头及桌面侧导航离边 20px。

600–939px 使用原始视口坐标：设备位于左半区，文案和三组说明位于右半区，字号与间距按 compact 系数收紧。小于 600px 保持全屏章节：功能文案顶部 65px，设备放在文案下方 24px，演示结束后为说明保留空间并缩小。横向说明轨道使用滚动吸附，底部距视口 35px，分页可点击或横滑。开场手机文案顶部 47px、高 398px，设备顶部 452px。

**The Persistent Device Rule.** 章节转换移动同一个设备容器，不在每章重建独立手机。真实性图注是设备外固定元素，跟踪设备底边再向下 10px，不能随设备一起缩小。

## Elevation & Depth

舞台深度由设备柔和投影、颗粒和边缘柔化组成；功能文字不放进装饰卡片。设备投影为 `drop-shadow(0 20px 18px #00000035)`。顶部和底部边缘使用 110px 高、5px backdrop blur 的渐隐区；手机缩为 28px。Canvas 颗粒 overlay 透明度 .18，256×256 tile，仅在初始化、尺寸变化或恢复页面时绘制静态纹理，设备像素比上限 1.25；不再定时随机刷新，避免纹理覆盖手机时产生闪烁。

功能章节之间设备外框保持同一坐标、尺寸和投影，不随换页移动或缩放；只有屏幕裁剪层替换封面和录像内容。标题首屏保留单独构图，进出标题页使用 1.5 秒 transform 过渡；初次加载与功能页互切不启用设备过渡。左右文案以归一化鼠标位置乘 12/20 横向幅度、9 纵向幅度，使用 220ms 时间常数的指数阻尼，收敛后停止更新；中央设备保留鼠标阻尼视差并用 translate3d 独立合成，避免帧率变化影响跟随速度。文字由 18px 位移及 8px 模糊恢复，说明分组延迟 .3/.46/.62s。重播后恢复播放状态。减少动态偏好关闭空间视差和录屏自动播放，直接显示实际应用静态封面与完成状态；保留信息和可操作章节。内部实录按 1.5 倍播放。

## Shapes

下载按钮使用 button 圆角，功能图标使用 app-mark，开场图标使用 opening-mark。标签为 pill，重播为圆形。持久设备基础尺寸 432×903px，截图覆盖这一坐标；视频按 Android 屏幕区域覆盖：inset 1.6% 3.8% 1.6% 3.1%，宽 93.1%、高 96.8%，object-fit:fill，圆角 56px。

## Components

### Buttons

主下载按钮宽 156px、最小高 53px，双行文字配 24px 内联 SVG，图文间距 10px，悬停上移 2px。手机宽 150px、最小高 50px。结尾按钮独立放大为 800×266px、圆角 30px，图标 100px、主文字 66px；手机为容器宽度、125px 高、圆角 14px、主文字 25px。结尾不是所有按钮的通用尺寸。

焦点统一为 2px 强调色外框，偏移 5px。页头主题按钮为透明文字控制，hover 透明度 .6。图标用内联 SVG。

### Replay

桌面橙色圆形重播以 150px 乘 replay-scale，后者为 max(.5,画布比例×设备比例)，定位到设备可见区域中心。出现时从 .6 倍缩放恢复，悬停 1.04、按下 .97。演示完成后悬停或键盘聚焦可见。手机为固定 38px 图标按钮，位于设备右侧，完成后直接可见。

### Tags

标签使用 tag token，12px / 20px 文字、4px 间距。手机使用 11px / 16px、4px 8px 内边距并居中排列。

### Navigation

侧边九条刻度，普通 8×1px，首尾及当前 12×2px，当前为强调色；名称悬停或聚焦显示。手机刻度宽 6px，底部微型方向键隐藏。桌面微型方向键为 6px 方块，按下短暂放大 1.35。顶部演示进度高 3px。移动端说明分页宽 28px，选中从 1px 增至 3px 并使用强调色。

滚轮、键盘、触摸和导航共享章节状态；键盘支持方向键、Page、空格、Home/End，纵向触摸超过 40px 切换，横向说明独立滚动。普通章节步进有 850ms 过渡门限，可在演示结束前切换；切换会暂停旧视频、隐藏视频层、取消播放进度帧，并用播放版本标识防止旧异步结果影响新章节。无 JavaScript 时提供单列可读后备，不是启用交互时的移动布局。

### Device demonstration

设备内使用 assets/native/ 的七段实际操作 MP4：overview、entry、week、statistics、assistant、receipt、preferences，配套静态封面由同一应用采集。播放器 muted、playsinline、preload="none"，没有网页绘制的应用弹窗、图表、聊天回复、触点或提示条。固定图注明确“应用实录 · 2.0.1 本地构建 · 演示账本”；素材由 Android API 35 模拟器运行本地 debug APK 采集，不代表正式 2.0.0 下载包的录像。

顶部进度直接取 currentTime/duration；播放器固定 playbackRate=1.5，ended 后进入完成状态，重播将同一片段从 0 开始并保持该速度。播放拒绝、媒体错误或减少动态偏好时进入完成状态，保留实际静态封面；开场与结尾没有录像。视频只在固定设备屏幕裁剪层中显示，设备外框不因换章重建、移动或缩放，不添加合成应用操作。device-frame.png 仅含透明屏幕孔洞之外的物理边框；屏幕图片与视频 poster 使用 *-screen.png 原始无框截帧，视频首帧解码后才显现，加载阶段同样只存在一层物理边框。

## Do's and Don'ts

### Do:
- **Do** 保留同一持久设备和九章共享状态。
- **Do** 使用橙色区分进度、重播和选中状态。
- **Do** 保持固定 11px 真实性图注处于设备变换之外。
- **Do** 扩展标题时验证自托管字体子集覆盖。
- **Do** 为减少动态偏好保留完成状态、说明轮播和章节操作。

### Don't:
- **Don't** 自行绘制应用中不存在的弹窗、聊天回复、图表或提示条来替代实际操作。
- **Don't** 将 2.0.1 本地构建实录称为正式 2.0.0 下载包录像。
- **Don't** 将移动端恢复成旧版自然滚动堆叠作为本轮交互实现。
- **Don't** 将独立官网的视觉规则推广到博客全局或 Android 应用。

<!-- Not canonized: no new craft defect identified in the source sample. Known tradeoffs: shortest mobile viewports shrink the device to reserve readable fixed text; recordings show a local 2.0.1 debug build with demonstration data, distinct from the formal 2.0.0 download. No UI changes in this documentation pass. -->
