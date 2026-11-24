Title: 00. 概览与版本档案 (Pelican)
Nav_title: 00. 概览与版本档案
Description: Python 经典 Jinja2 静态站点生成器 Pelican 4.12.0 基准实测子站。
Order: 00
Slug: index
URL:
Save_as: index.html

# Pelican (`4.12.0`) 基准实测子站

本子模块由主仓 `page2401.github.io/docs/` 标准 GFM 母版**最小化派生适配**而来，实测 Python 生态最富盛名的经典内容/博客型静态生成器 **`pelican@4.12.0` + `Jinja2@3.1.6` + `Markdown@3.11.3` + `pymdown-extensions@13.1.2`** 在改造为多级技术文档站点时的元数据模型、路由重写机制与全离线图表/公式表现。

## 精确锁定版本档案（`requirements.txt` + 本地 Vendor）

Python 构建环境通过独立虚拟环境与 `requirements.txt` 严格 `==` 锁死版本，前端 KaTeX 与 Mermaid 资源全部内聚于 `theme/static/vendor/`，实现 **0 外部 CDN 请求**：

| 模块 / 依赖包 | 精确锁定版本 | 在本子站中的职责与实测边界 |
| :--- | :--- | :--- |
| `pelican` | `4.12.0` | Python 经典静态生成器核心（`pelicanconf.py` 可执行配置 + `{filename}` 内链校验） |
| `jinja2` | `3.1.6` | 经典模板继承引擎（`theme/templates/base.html` 与 `page.html` 构建多级导航） |
| `markdown` | `3.11.3` | Python-Markdown 解析器（启用 `meta`、`tables`、`toc`、`admonition`、`codehilite`） |
| `pymdown-extensions` | `13.1.2` | 补齐 `pymdownx.details`、`pymdownx.superfences` 与 `pymdownx.arithmatex` |
| `pygments` | `2.19.2` | 受 `pelican==4.12.0` 上游元数据 `pygments<2.20.0,>=2.16.1` 硬性封顶约束（同批 MkDocs/Sphinx 为 `2.21.0`） |
| `unidecode` | `1.4.0` | Pelican 默认用其将中文 `Title` 转写为拼音 URL（需用 `PATH_METADATA` 拦截） |
| `katex` (vendored) | `0.19.1` | 配合 `arithmatex (generic: True)` 在同源本地渲染数学公式与本地 Webfont |
| `mermaid` (vendored) | `12.3.0` | 配合 `superfences` 自定义围栏在客户端渲染矢量图表并联动深浅色主题 |

## 五大标准基准章节导览

| 章节路径 | 测试维度 | 相对母版 `docs/*.md` 的核心派生改造点 |
| :--- | :--- | :--- |
| [`01-annotations.md`]({filename}./01-annotations.md) | 专属标注与元数据 | 头部必须改用无引号 **MultiMarkdown `Key: Value`** 元数据（写 YAML 双引号会被原样保留进标题！）；提示框改写为 4 空格缩进 `!!!` / `???`；原生不解析 `> [!NOTE]` |
| [`02-diagrams.md`]({filename}./02-diagrams.md) | 流程图与时序图 | 正文代码块零改动；因 `pelicanconf.py` 是纯 Python 代码，可直接传入 `fence_code_format` 函数引用（免除 `mkdocs.yml` 的 `!!python/name:` 标签） |
| [`03-math.md`]({filename}./03-math.md) | 数学公式排版 | 正文公式零改动；`pymdownx.arithmatex` 无损保护矩阵双反斜杠 `\\`，交由本地 KaTeX 0.19.1 排版 |
| [`04-directory/`]({filename}./04-directory/index.md) | 目录结构与路由取舍 | 深度拆解 Pelican 博客基因（`articles` vs `pages`）、中文 `Title` 拼音化陷阱、`URL`/`Save_as` 显式路由与 `{filename}` 内部链接协议 |
