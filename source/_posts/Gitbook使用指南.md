---
title: Gitbook使用指南
date: 2025-9-22 21:42:03
tag: 工具
categories: 工具
cover: https://s2.loli.net/2025/09/22/5edIWiGLcVoZ792.png
---

当我决定将我的学习笔记上传至Gitbook而不是直接上传至个人主页时，我将遭受到墓前所遇到的最大的阻碍。纵观全网在提到gitbook时，大部分都是本地`gitbook init`后生成书籍，当想要在线浏览时更多的是与Github联动,然而我并没有找到有关于gitbook官方网站的使用办法，再加上我的翻译功能在此遭遇了机生最大的滑铁卢——翻译完全失效了！

所以我决定写一篇关于Gitbook官网,及在线编辑book的教程。

## 准备工作

对于Github的安装和gitbook的安装想必前辈们已经总结出非常多样化的方法，各位按需拿取即可，本人在这里不做过多赘述，让我们直接进入目标环节

### 登陆

我们可以直接打开[GitBook – Build product documentation your users will love](https://www.gitbook.com/)网站，选择众多登陆方式中的一种，在这里我选择也推荐使用Github登陆

![image.png](https://s2.loli.net/2025/09/22/5edIWiGLcVoZ792.png)

成功登入后选择来到Home界面，会看见布局如下图所示。

#### 顶部功能与用户区

- 用户名 `[yourname]`：你当前登录的账号。

- 搜索、通知图标：用于搜索页面或查看通知。

  <img src="https://s2.loli.net/2025/09/22/nIWDHfCcouTmrz3.png" alt="image.png" style="zoom: 33%;" />

#### 平台功能入口

- **Home**：平台主页，是默认的起始页面。
- **Docs sites**：文档站点入口，用于管理**对外发布的文档网站**。
- **Docs Agents**：**AI 辅助文档优化工具（Docs Agent**。
- **OpenAPI**：通过**上传或关联 OpenAPI 规范**（一种通用的 API 描述格式），无需手动编写任何内容，就能**自动生成 API 文档**。
- **Translations**：翻译功能，**借助 AI 实现 “内容自动多语言翻译”**。
- **Integrations**： **GitBook 的「集成（Integrations）」页面**，作用是通过对接各类第三方应用，增强 GitBook 的功能体验。

#### 内容组织单元

GitBook 用「Docs sites（文档站点）」和「Spaces（空间）」来分层管理文档：

- **Docs sites**：代表「文档站点」—— 是将文档 **对外发布成可访问的 “网站形态”** 的集合。你可以把它理解为 “最终面向读者的文档网站”，用于管理要公开的文档站点。
- **Spaces**：代表「空间」—— 是**内部创作、协作的 “项目容器”**。每个 Space 可包含一组相关文档（比如一个项目、一门课程的文档），用于在发布前进行创作、编辑、协同管理。
- **Trash**：「回收站」，存放已删除的内容，可恢复或永久删除。

简言之，左侧导航通过 “功能入口 + 内容分层（站点 / 空间）” 的结构，帮助你高效管理文档的**创作、组织、发布与协作**。

![image.png](https://s2.loli.net/2025/09/22/qoZvBdQGcwe9XCm.png)

以上是基本功能的介绍，剩余未介绍的将会在使用过程中逐步提及。

## 创建Github仓库

接下来小伙伴千万别着急直接点击主页的**New**进行下一步，为了操作的连续性，接下来我们需要移步Github创建存储仓库

### 新建仓库

你可以选择不同的存储方式

- 将所有书籍存储在一个Github仓库中，这也是我所使用的，接下来将会以这个方式来编写教程
- 将单个书籍存储在单个仓库，因为方式和上一个方法差不多所以这里不再多说，仅仅是后续命名的差别

同样点击**New**后来到新建储存库环节

![image.png](https://s2.loli.net/2025/09/22/jMyEGrVRsDkoc4L.png)

仓库名称尽君心意，但要便于理解，接下来可以选择添加README文件和License文件，直接创建即可

### 链接仓库

创建完成后，在任一文件夹（合理即可）打开终端，键入以下内容链接到刚才创建的仓库

```shell
echo "# test" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/shanchuann/test.git
git push -u origin main
```

结果

```shell
Enumerating objects: 3, done.
Counting objects: 100% (3/3), done.
Writing objects: 100% (3/3), 216 bytes | 216.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/shanchuann/test.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

刷新刚才的储存库，基本的设置便已完成

![image.png](https://s2.loli.net/2025/09/22/HrsdY1SmBiCpX4L.png)

你可以任意修改README文件和描述，网站待所有配置完成后也可以添加进去

## 创建Gitbook书籍

点击**New**后，出现以下列表内容，这是文档协作 / 管理平台（如 GitBook 类工具）中 **“新建内容” 的下拉菜单**，用于创建或导入不同类型的内容载体

![image.png](https://s2.loli.net/2025/09/22/u3Lpxek5zVWdDEo.png)

- **New space**：为你的内容创建一个「空间（Space）」——Space 是组织、管理一组相关内容的 “容器”（比如一个项目、一类主题的文档集合），便于内部创作与协作。
- **New collection**：为你的内容创建一个「集合（Collection）」—— 用于对内容进行归类分组，把相关文档 / 资源聚合成一个集合，方便整理和查找。
- **New docs site**：发布你的「文档站点（Docs site）」—— 将文档发布为**可公开访问的网站**，让外部用户能浏览你的文档。
- **Import content**：从其他来源「导入内容」—— 支持从外部平台（如其他文档工具、代码仓库等）导入已有内容，方便资源迁移或整合。

在这里我是用的是**New docs site**，在对其命名后进入最重要的环节——链接Github仓库

![image.png](https://s2.loli.net/2025/09/22/mfLg72i3sydr9AW.png)

### 链接Github仓库

点击**Sync with Git**后，选择你要是用的仓库，因为刚才一直是基于Github的，所以选择**Github Sync**

![image.png](https://s2.loli.net/2025/09/22/KSm4Vxpiu3Ognk1.png)

![image.png](https://s2.loli.net/2025/09/22/R3VsPnSH8Gab2UL.png)

**Next step**，按提示选择链接Github，选择用户，选择仓库，选择分支（这里我选择main）

![image.png](https://s2.loli.net/2025/09/22/4Wr3jhvMGl6x2Ub.png)

最主要的是在**Monorepo**下的**Project directory**确定你在Github创建的文件夹名称，建议以你的书籍名为主

![image.png](https://s2.loli.net/2025/09/22/19tOzxUaBKDqyAP.png)

之后的选项根据需求选择，**Initial sync**需要选择**GitBook to GitHub**。

#### Commit messages（提交信息）

- **Use a custom template**：控制是否用「自定义模板」替换 GitBook 导出时的**提交信息格式**。
  - 开关当前为「关闭」，此时使用 GitBook 默认的提交信息格式；若开启，可自定义提交信息的模板（点击 *Learn More* 可查看详细说明）。
  
    ![image.png](https://s2.loli.net/2025/09/22/QT9Cyu3kAWwhcK2.png)

#### Forks（派生仓库）

- **Pull request preview**：控制是否允许「从派生（forked）仓库」生成 Pull Request 预览。
  - 开关当前为「关闭」，此时仅主仓库能生成 PR 预览；若开启，派生仓库也可生成 PR 预览，便于多人协作时的内容预览。

#### Initial sync（初始同步）

- 作用：设置**第一次同步时，以哪一方的内容为 “源”**（决定首次同步时 “谁覆盖谁”）。
  - **GitHub to GitBook**：表示「我在 GitHub 上编写内容，同步时会将 GitHub 的内容导入，并替换 GitBook 空间（Space）里的内容」—— 即首次同步以 GitHub 内容为准，覆盖 GitBook。
  - **GitBook to GitHub**：表示「我在 GitBook 上编写内容，同步时会用 GitBook 的内容替换 GitHub 上的内容」—— 首次同步以 GitBook 内容为准，覆盖 GitHub。

点击**Sync**后等待进度完成，点击**View space**即可

![image.png](https://s2.loli.net/2025/09/22/3bYrMhqXQxoTpez.png)

## 书籍配置

忽略C语言圣经和C语言内容，着重于刚才创建的test，可以看见以下内容

![image.png](https://s2.loli.net/2025/09/22/wgPryxBepuHE7Od.png)

这是 **GitBook（文档协作与管理平台）的文档界面**，用于对文档进行查看、编辑与协作管理，各区域功能如下：

### 顶部操作栏

- **状态标识**：`Read-only` 表示当前文档处于「只读模式」；`Synced √` 表示内容已与远程（如 GitHub 等同步源）完成同步。

- **功能按钮**：

  - `Preview`：切换文档的 “预览视图”，查看发布后的效果；

    ![image.png](https://s2.loli.net/2025/09/22/Gfck4p8rWt7Bznw.png)

  - `Share`：生成分享链接，将文档分享给他人；

    你可以选择权限等其他附属操作

  - `Change requests`：管理 “变更请求”（类似代码协作中的 Pull Request，用于多人协作时的内容审核与合并）；

  - `Edit`：点击可进入「编辑模式」，对文档内容进行修改，这是之后对书籍编辑的关键。

### 左侧导航栏

展示文档的**结构层级**（如文件夹、页面列表），当前显示的是名为「Page」的文档页面，用于在多文档间快速跳转。

### 右侧内容区

展示当前选中页面的**具体内容**，图中是一个名为「Page」的空白页面（可在编辑模式下添加文字、图片、代码等内容）。

简言之，这个界面支持文档的 “查看、编辑、同步、分享、协作审核” 等全流程管理，帮助团队高效创作与维护文档。

## 编辑内容

在点击**Edit**后进入编辑主要界面，在一系列繁杂的操作后，可以开始你的在线电子书编辑之旅了

![image.png](https://s2.loli.net/2025/09/22/GzRAeZu9Ifhk75w.png)

### 顶部操作栏

- **状态与模式**：显示当前变更分支 / 草稿名（`Sep 22 changes #2`）、状态（`Draft` 表示草稿），以及 `Editor`（编辑视图）、`Changes`（变更记录）、`Preview`（预览效果）等切换标签，支持不同工作流模式。
- **协作与合并**：右侧 `Merge` 按钮用于**合并协作变更**（类似代码仓库的 “合并请求”），旁边的图标（信息、同步、成员、评论、历史等）支持文档的**协作管理、版本追踪、成员邀请**等操作。

### 左侧结构面板

- **内容组织**：含 `Pages`（页面列表，管理文档的 “页面层级”）、`Reusable content`（可复用内容，提取通用模块跨文档复用）、`Files`（文件，管理文档相关的附件 / 资源）。当前在 `Pages` 标签下，可通过 `Add new...` 添加新页面，搭建文档结构。

### 主内容编辑区

- **文档编写**：显示名为 `Page` 的文档，包含「可选页面描述（`Page description (optional)`）」和「内容输入区（`Enter your content here...`）」，是撰写文档的核心区域。
- **快捷操作**：
  - `Import content`：从外部来源（如其他文档、文件）**导入内容**，快速迁移资源；
  - `Use a template`：使用**文档模板**，快速生成标准化结构（如技术文档、教程模板）；
  - `Set up Git Sync`：关联 **Git 仓库**，实现文档与代码仓库的版本同步（类似 “Git 双向同步”）；
  - `Add members`：邀请**协作成员**，实现团队共同编辑文档。

在标题处你可以选择更深层的个性化

![image.png](https://s2.loli.net/2025/09/22/zqEuNSc923X6V7F.png)

- **Page options**：页面选项（用于设置页面的属性、执行页面级操作，比如调整页面结构、权限等）；
- **Page cover**：页面封面（设置页面的封面图，美化或标识页面主题）；
- **Comment on page**：对页面评论（在当前页面发起或查看评论，用于团队协作时的讨论互动）；
- **Editor feedback**：编辑器反馈（向平台的 “文档编辑器” 功能提建议、反馈问题，帮助优化编辑体验）。

左侧**Add new**后可以选择添加新的页面或其他的内容,很可惜**Translation**需要Pro

![image.png](https://s2.loli.net/2025/09/22/Dy4o8aSiMKtTCk9.png)

- **Page**：用于创建或管理单个页面内容；
- **Group**：对内容进行分组管理，将相关页面等归类；
- **Link to**：创建链接，可关联到其他内容或外部地址；
- **OpenAPI Reference**：管理或查看遵循 OpenAPI 规范的 API 文档参考；
- **Translation**：进行内容的多语言翻译相关操作；
- **Import pages**：从外部导入页面内容，整合已有文档。

![image.png](https://s2.loli.net/2025/09/22/YdPAg4NLk3yrDIp.png)

## 上传书籍

当内容编辑的差不多后，你可以点击右上角紫色按钮查看选项

![image.png](https://s2.loli.net/2025/09/22/LgyItWYqFkGN6Pn.png)

这是**协作平台（如文档 / 代码管理工具）中 “合并变更” 的操作菜单**：

- **Merge**（立即合并）：选中状态，可 “立即合并你的变更”，无需额外审核，直接应用修改。
- **Request a review**（请求评审）：未选中，可 “在合并前通知并允许他人审核”，适合需要团队评审后再合并的协作场景。
- **Configure merge rules**（配置合并规则）：用于 “定义合并变更请求的规则”，比如设置必须通过某些检查后才能合并，保障合并的规范性。

因为我的书籍我做主，所以我选择**Merge**直接Allin

再次进入Github界面刷新刚才创建的储存库后发现内容已经更新

![image.png](https://s2.loli.net/2025/09/22/rMPE5ht6kSCTcqn.png)

回到Gitbook界面，直接跳过前六条教程，会看见**Publish**按钮，直接点击

![image-20250922232250072.png](https://s2.loli.net/2025/09/22/1Gqv8uPtYL7TDMO.png)

点击后可能面临两种情况，一种是直接发布成功，从链接进入后可以欣赏到自己的大作

![image.png](https://s2.loli.net/2025/09/22/Juam23YT7FDxHeB.png)

另一种可能会弹出订阅的界面

![9f1468bc-aae5-428e-bd30-feea409cc42d.jpg](https://s2.loli.net/2025/09/22/Oc9ezWdmBnEqQro.jpg)

这时候我们回到**Setting**界面，选择**plan**后更改为**Free**，即可正常发布，进入下一步。

![image.png](https://s2.loli.net/2025/09/22/6EFn8W7jAUPRqVI.png)

## 基本内容

![image.png](https://s2.loli.net/2025/09/22/crzmNBhZUtDkORv.png)

这是 **GitBook（文档站点管理平台）的「常规（General）设置」页面**，用于配置站点的基础属性与关键操作，各模块作用如下：

### 左侧导航栏

列出站点设置的核心分类，可切换不同配置模块：

- `General`：当前页，管理 “常规属性”；
- `Audience`：受众设置（控制谁能访问站点）；
- `Domain and URL`：域名与网址配置；
- `Redirects`：重定向规则；
- `AI & MCP`：AI 与相关能力配置；
- `Structure`：站点结构管理；
- `Customization`：自定义样式 / 外观；
- `Plan`：订阅计划相关。

### 主内容区（General 页）

#### Site name（站点名称）

- 功能：修改**GitBook 内部显示的站点名称**（当前名称为 `test`）。
- 说明：若要修改 “已发布站点对外显示的标题”，需前往「Customization（自定义）」设置。

#### Sharing（分享）

- `Social preview`：自定义站点在**社交媒体分享时的预览图**（点击「Manage social preview」可上传图片，优化分享视觉效果）。

#### Danger zone（危险区域）

包含高风险操作，需谨慎使用：

- `Unpublish site`：下架站点（站点将不再对外部用户可见，但可随时用原 URL 重新发布）；
- `Delete site`（部分显示）：删除站点（永久移除站点资源）。

### Domain and URL

在**Domain and URL**中，可以配置你的电子书网址

![image.png](https://s2.loli.net/2025/09/22/97PuJmkYjBwQEg3.png)

#### 「Custom domain（自定义域名）」模块

- 作用：用**自己的域名**匹配品牌（示例：`docs.yourcompany.com`）。
- 操作：点击 `Set up a custom domain` 可配置专属域名。

#### 「Subdirectory（子目录）」模块

- 作用：在**现有域名的特定路径**下托管站点（示例：`yourcompany.com/docs`）。
- 操作：点击 `Set up a subdirectory` 可配置子目录路径。

#### 「Customize URL（自定义网址）」模块

- 「Edit slug」部分：
  - 作用：修改站点的 `slug`（网址中 “标识性的路径片段”），让 URL 更短、简洁、易记。
  - 示例：当前 URL 为 `https://shanchuan-1.gitbook.io/test`，可编辑 `test` 这段 `slug`，点击 `Save` 保存修改。

很遗憾，Custom domain和Subdirectory需要 “高级版” 权限，但是Customize URL已经绰绰有余了

其余部分不做赘述，接下来就可以点击**Visit**进入电子书的阅读环节了

## Gitbook

如你所见，我们已经完成了电子书的基本配置

![image.png](https://s2.loli.net/2025/09/22/y8cWCoBXlYA42GF.png)

至于内容方面就请各位各显神通了，希望这篇文章能够帮到你。
