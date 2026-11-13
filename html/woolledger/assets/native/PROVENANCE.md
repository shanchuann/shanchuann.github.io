# 应用实录素材来源

2026-11-13 在独立 Android 35 x86_64 模拟器 WoolLedgerWebsiteCapture 中安装并操作本地 `android/WoolLedger/app/build/outputs/apk/debug/wool_ledger.apk`。包名 com.wool.ledger，versionName 2.0.1，versionCode 201。该构建的录像不代表下载按钮所指向的正式发布版本；下载配置独立维护。

模拟器使用应用自身首次启动创建的演示账本，随后通过应用 UI 实际执行演示操作。没有连接、读取或修改用户已有设备账本，没有配置模型密钥。所有弹窗、确认卡片、统计、小票和提示均由应用渲染，官网没有叠加应用 UI。

| 文件 | 录制流程 | 应用源码依据 |
| --- | --- | --- |
| overview.mp4 | 首页下滑查看最近记录，再回到顶部 | ui/home/HomeFragment.java |
| entry.mp4 | 记一笔 → 金额15 → 餐饮 → 保存 → 返回首页 | ui/add/AddRecordActivity.java 的 setupSave/save |
| week.mp4 | 首页已占用的周五午间格 → “这一格”明细 → 返回 | HomeFragment 的 table.setListener、ui/cell/CellActivity.java |
| statistics.mp4 | 统计页面滚动查看分类、时段与对比 | ui/stats/StatsFragment.java |
| assistant.mp4 | 内置快捷句“帮我记：午饭15，地铁3” → 原生待确认卡片 → 确认执行 → 查本周支出 | ui/chat/ChatActivity.java、ChatAdapter.java、agent/AgentEngine.java |
| receipt.mp4 | 统计页“看月度小票”箭头 → 应用生成并展示小票 → 滚动 | StatsFragment 的 pillGo、ui/report/AiReportActivity.java |
| preferences.mp4 | 我的 → 默认时段原生菜单 → 返回 → 切换深色 → 浏览设置 | ui/settings/SettingsFragment.java、MainActivity.java |

MP4 由 Android screenrecord 直接录制，之后仅做 H.264 无音轨转码和 faststart 封装；没有重排操作、替换 UI、加入字幕弹窗或修改金额。录制时启用了 Android 自带触摸位置显示。原始录像与操作脚本保存在开发工作目录 `android/_preview/woolledger/native/`。

静态 PNG 是对应应用实录截帧，放入仓库原有 `docs/screenshots/home.png` 的设备外框；只缩放、圆角裁切并合成边框，不修改应用内部内容。PNG Source 元数据保留这一来源。首页种子账目随后因实际保存15元和Agent确认18元而变化，数值由应用数据库计算。

运行时现已将外框与屏幕完全拆开：`device-frame.png` 是屏幕区域透明的独立物理边框；`*-screen.png` 为原始模拟器屏幕截帧，不含物理边框，供静态层和视频 poster 共用。播放器解码到首帧后才显现。原合成 PNG 保留作历史素材，运行时不再用作封面，以免加载阶段出现嵌套手机边框。应用画面内容和录像未修改。

旧版 v1.54 截图仍在上级 assets 目录作为历史素材，本版运行时展示与预加载均使用当前 native 目录。
