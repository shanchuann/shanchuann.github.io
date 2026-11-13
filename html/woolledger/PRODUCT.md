# 羊毛账本官网

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
现有 Hexo 博客中的独立静态 HTML/CSS/JavaScript 页面，相对资源路径，无前端构建依赖。

## Product Purpose
向访客介绍羊毛账本 Android 应用，展示真实界面并提供获取应用和源码的入口。

## Capabilities and Constraints
功能依据 D:/Qimo/YiDongKaiFa/README.md：消费课表、文字与离线语音录入、统计预算、蓝羊羊助手、小票报告、CSV 数据导入导出、支付通知记账。运行环境 Android 7.0+。在线 AI 需要用户另行配置，联网请求可能产生服务商费用；通知记账依赖授权与通知内容。

## Brand Commitments
用户指定参照 https://hole.money/ 复刻页面构图与交互，替换为羊毛账本品牌与真实功能。名称“羊毛账本”，口号“一句话，记一笔”。

## Evidence on Hand
用户最新明确要求：页面必须展示应用实际操作逻辑，不得自行添加应用中没有的弹窗。已取消网页 DOM 识别弹窗、假聊天回复、假图表和提示条，改为独立 Android 35 模拟器运行本地 2.0.1 debug APK 后录制的七段操作视频。视频含应用自带的种子演示账目及本次真实操作，UI 不做二次绘制；手机边框合成不改变应用内容。下载入口仍按既有正式发布配置管理，录像版本单独标注。

当前运行素材为 assets/native/ 的实录视频与封面，采集自本地 2.0.1 构建。原 docs/screenshots/ 的六张 1.54 图片只保留作历史素材，不再作为当前应用界面展示。应用图标仍来自本地项目。

## Distribution
本轮范围：九章全屏、共享设备缩放、鼠标阻尼视差、橙色重播和移动端横向说明保留；设备内播放运行真实应用后采集的七段模拟器录像。网页播放本身不连接用户账本。当前版本明确区分应用实录、演示账本与下载包的正式版本。

2026-11-13 使用 GitHub Releases API 核实正式 v2.0.0 发布，下载入口指向其 WoolLedger-2.0.0-release.apk；可在 config.js 集中更新。旧用户升级签名选择以发布说明为准。
