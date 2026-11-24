Title: 02. 流程图与时序图
Description: Pelican 4.12.0 实测：通过 pelicanconf.py 挂载 pymdownx.superfences 自定义 mermaid 围栏与本地 mermaid@12.3.0。
Order: 02
Slug: 02-diagrams
URL: 02-diagrams/
Save_as: 02-diagrams/index.html

# 02. 流程图与时序图（Pelican + `superfences` + 本地 Mermaid `12.3.0`）

相比采用 YAML 配置文件、不得不书写 `!!python/name:pymdownx.superfences.fence_code_format` 特殊反序列化标签的 MkDocs，Pelican 的配置文件 `pelicanconf.py` **本身就是标准 Python 模块**——可直接 `from pymdownx.superfences import fence_code_format` 传入可调用对象，将母版 ```` ```mermaid ```` 围栏一字不改编译为 `<pre class="mermaid"><code>...</code></pre>`，再由 `theme/static/vendor/mermaid.min.js` 在本地渲染并随深浅色主题切换重绘。

## 1. 复杂子图与架构流程图（`flowchart TD`）

测试中文节点标签、子图嵌套（`subgraph`）、尖括号 `<id>` 转义安全与虚线边：

```mermaid
flowchart TD
    subgraph MainRepo["主仓库 page2401.github.io"]
        Master["母版 docs/*.md (Pure GFM)"]
        SubPtr["Git Submodule 指针 (sites/*)"]
        Workbench["对比工作台源码 (main)"]
    end

    subgraph SubRepo["各独立派生子仓库 (sites/<id>)"]
        SrcBranch["main 分支: 框架配置 + 派生适配版 *.md"]
        Actions{"GitHub Actions 构建"}
        PageBranch["page 孤儿分支: 纯静态产物 + .nojekyll"]
        SrcBranch --> Actions
        Actions -->|"自动构建发布"| PageBranch
    end

    Master -.->|"按各框架方言派生"| SrcBranch
    SubPtr -.->|"跟踪 main 分支"| SrcBranch
    Workbench -->|"对比母版与各派生版差异"| Portal["https://page.2401.xyz/"]
    PageBranch -->|"GitHub Organization Pages"| SubSite["https://page.2401.xyz/<id>/"]
```

## 2. 编译管线交互时序图（`sequenceDiagram`）

测试多参与者生命线、`alt` 分支块及激活框（`activate`/`deactivate`）：

```mermaid
sequenceDiagram
    autonumber
    actor Author as 文档作者
    participant Master as 主仓母版 docs/*.md
    participant SubGit as 子模块 main 分支
    participant CI as GitHub Actions (Python 3.12)
    participant Pages as GitHub Pages (page 分支)

    Author->>Master: 编写标准 GFM 基准母版
    Master->>SubGit: 派生适配 Pelican MultiMarkdown 头与 {filename}
    SubGit->>CI: 触发 deploy-page.yml 工作流
    activate CI
    alt 编译型 Python SSG (Pelican / MkDocs / Sphinx)
        CI->>CI: pelican content -o output -s pelicanconf.py
    else 运行时引擎 (Docsify v4 / v5)
        CI->>CI: 组装原始 *.md + _sidebar.md + 锁定版本 vendor
    end
    CI->>Pages: force_orphan 推送至孤儿分支 page
    deactivate CI
    Pages-->>Author: 同源子路径 /pelican/ 即刻生效
```

## 3. 子模块同步状态机（`stateDiagram-v2`）

测试状态机语法与状态迁移说明标签：

```mermaid
stateDiagram-v2
    [*] --> MasterEdited: 更新主仓母版 docs/*.md
    MasterEdited --> SubmoduleDerived: 同步派生适配至各子模块 *.md
    SubmoduleDerived --> SubmodulePushed: 子模块 commit & push origin main
    SubmodulePushed --> PageDeploying: 子仓库 Actions 自动更新 page 分支
    SubmodulePushed --> MainRepoUpdated: 主仓库更新子模块指针并构建对比数据
    PageDeploying --> LiveSynced: 线上渲染与母版源码差异视图全部就绪
    MainRepoUpdated --> LiveSynced: 计算相对母版改动行数完成
    LiveSynced --> [*]
```
