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

用户指定的 Money Hole 构图和交互权威落实为九章全屏叙事、共享设备缩放、阻尼视差、橙色重播和手机内 DOM 示范。桌面、平板、手机共享章节状态而采用不同空间安排；手机也使用全屏章节和横向说明轮播。真实 v1.54 截图与网页示范明确区分，不将旧图描述成新版本录屏。

**Key Characteristics:**
- 中性灰与墨色反转，橙色标记交互状态。
- 自托管中文衬线大标题与无衬线说明。
- 持久设备、分层视差与可重播的屏内示范。
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

**The Two Voices Rule.** 标题使用自托管衬线字形，说明与操作使用无衬线；网页演示内部字体保持应用示范语境。

## Layout

整个页面为固定视口舞台，html/body 隐藏溢出。桌面使用 1280×832 设计坐标，比例为 min(视口宽/1280,视口高/832)，画布高度随视口映射，1280px 内容框水平居中。九章绝对定位，只有当前章节可见并可交互，其他章节 inert。

开场文案在宽 1280px、高度减 173px 的区域居中，下方设备宽 1000 设计像素，顶部位于画布高度减 173px。功能章节左文案起点 60px、宽 376px，右说明起点 844px、宽 376px；设备居中、高 700 设计像素。页头及桌面侧导航离边 20px。

600–939px 使用原始视口坐标：设备位于左半区，文案和三组说明位于右半区，字号与间距按 compact 系数收紧。小于 600px 保持全屏章节：功能文案顶部 65px，设备放在文案下方 24px，演示结束后为说明保留空间并缩小。横向说明轨道使用滚动吸附，底部距视口 35px，分页可点击或横滑。开场手机文案顶部 47px、高 398px，设备顶部 452px。

**The Persistent Device Rule.** 章节转换移动同一个设备容器，不在每章重建独立手机。真实性图注是设备外固定元素，跟踪设备底边再向下 10px，不能随设备一起缩小。

## Elevation & Depth

舞台深度由设备柔和投影、颗粒和边缘柔化组成；功能文字不放进装饰卡片。设备投影为 `drop-shadow(0 20px 18px #00000035)`。顶部和底部边缘使用 110px 高、5px backdrop blur 的渐隐区；手机缩为 28px。Canvas 颗粒 overlay 透明度 .18，256×256 tile，83ms 更新，设备像素比上限 1.25；页面隐藏或减少动态偏好时停止连续更新。

屏内 DOM 示范保留自己的应用材料：提示卡 `0 14px 35px #0000001c`，toast `0 8px 20px #0002`，定位框 `0 3px 12px #00000012`。这些只描述网页示范内部，不作为网站功能文案容器规则。

设备变换为 1.5s cubic-bezier(.3,0,.1,1)。左右文案和设备以归一化鼠标位置乘 12/14/20 横向幅度、9 纵向幅度，阻尼 .07。文字由 18px 位移及 8px 模糊恢复，说明分组延迟 .3/.46/.62s。演示结束后悬停设备放大 1.03；重播后恢复播放状态。减少动态偏好关闭空间视差、设备转换和示范动画，直接显示完成状态；保留信息和可操作章节。

## Shapes

下载按钮使用 button 圆角，功能图标使用 app-mark，开场图标使用 opening-mark。标签为 pill，重播为圆形。持久设备基础尺寸 432×903px，截图覆盖这一坐标；屏内示范按 Android 屏幕区域裁切，圆角 56px。

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

滚轮、键盘、触摸和导航共享章节状态；键盘支持方向键、Page、空格、Home/End，纵向触摸超过 40px 切换，横向说明独立滚动。普通章节步进有 850ms 过渡门限，可在演示结束前切换；切换会取消旧演示计时器与动画。无 JavaScript 时提供单列可读后备，不是启用交互时的移动布局。

### Device demonstration

真实截图作为底层，DOM 输入、图表、触点和确认提示作为演示层。设备外图注明确“网页模拟演示 · v1.54 界面 · 示例账目”。演示不连接用户账本。各章播放时长为 1400/3700/6500/4800/4800/5800/4600/4200ms，结尾不播放；完成后可重播。

## Do's and Don'ts

### Do:
- **Do** 保留同一持久设备和九章共享状态。
- **Do** 使用橙色区分进度、重播和选中状态。
- **Do** 保持固定 11px 真实性图注处于设备变换之外。
- **Do** 扩展标题时验证自托管字体子集覆盖。
- **Do** 为减少动态偏好保留完成状态、说明轮播和章节操作。

### Don't:
- **Don't** 将旧截图或 DOM 动画称为 2.0 真机录屏。
- **Don't** 将移动端恢复成旧版自然滚动堆叠作为本轮交互实现。
- **Don't** 将屏内演示卡片样式推广成官网功能说明卡片。
- **Don't** 将独立官网的视觉规则推广到博客全局或 Android 应用。

<!-- Not canonized: no new craft defect identified in the source sample. Known tradeoffs: shortest mobile viewports shrink the device to reserve readable fixed text; screenshot and DOM demonstration remain distinct from native application evidence. No UI changes in this documentation pass. -->
