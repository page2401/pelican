Title: 01. 专属标注与元数据
Description: 测试 Pelican 4.12.0 的 MultiMarkdown 无引号元数据、Python-Markdown !!! Admonition、??? Details 与 GFM Alerts 表现。
Order: 01
Slug: 01-annotations
URL: 01-annotations/
Save_as: 01-annotations/index.html

# 01. 专属标注与元数据（Pelican MultiMarkdown 头 + `!!!` 缩进体系）

不同静态网站生成器对“提示框 / 标注（Callouts / Admonitions）”和页面元数据的语法约定存在显著分歧。本文件由标准 GFM 母版派生适配至 **Pelican (`4.12.0`)**。

## 1. Frontmatter 元数据机制（MultiMarkdown 键值头而非 YAML！）

这是从现代 YAML 母版迁移至 Pelican 时最隐蔽的第一道语法陷阱——Pelican 默认挂载的 `markdown.extensions.meta` 解析的是 **MultiMarkdown `Key: Value` 头部**而非标准 YAML：

- **双引号原样残留陷阱**：若直接保留母版的 `title: "01. 专属标注与元数据"`，解析器不会剥离外层引号，导致网页标题直接带出字面量双引号 `"01. 专属标注与元数据"`！派生时必须去掉引号写作 `Title: 01. 专属标注与元数据`。
- **一等公民路由控制字段**：Pelican 允许在每篇文档顶部通过 `Slug`、`URL`、`Save_as`、`Order`、`Parent` 直接接管物理输出路径与模板属性（上方页面徽章实时展示了当前页解析出的 `Slug` / `URL` / `Save_as`）。

## 2. 标准提示语义块（Python-Markdown `!!!` + 4 空格缩进）

开启 `markdown.extensions.admonition` 后，Pelican 采用与 MkDocs 同源的 **`!!! <类型> "可选自定义标题"` + 4 空格缩进** 块语法：

!!! note
    默认信息提示块：静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支，互不污染提交历史。

!!! tip "性能优化建议（自定义标题语义）"
    在 Python-Markdown `admonition` 体系中，自定义标题包裹在英文双引号 `"..."` 内；正文多段落或列表必须严格保持 **4 空格缩进**，缩进回退即闭合容器。

!!! warning "版本边界注意"
    注意区分各派系关键字与边界——VitePress / VuePress 使用成对的 `::: warning ... :::`，Astro Starlight 使用 `:::caution[标题]`，而 Pelican 与 MkDocs 均依赖缩进定界的 `!!! warning`。

!!! danger "不可逆分支覆盖警告"
    自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！

## 3. 可折叠详情容器（`pymdownx.details` 的 `???` 语法）

搭配 `pymdown-extensions` 的 `pymdownx.details` 扩展后，使用 `??? note "标题"` 加 4 空格缩进即可在折叠容器内部无缝混排 Pygments 语法高亮代码块与数学公式（若直接书写原生 HTML `<details>` 且不额外开启 `md_in_html`，内部 Markdown 将不会被解析）：

??? note "点击展开查看 Pelican 折叠容器源码结构"

    ```markdown
    Title: 示例文档
    URL: demo/
    Save_as: demo/index.html

    !!! tip "Pelican 提示块"
        正文与代码块相对 ??? 行保持 4 空格缩进。
    ```

    除了代码块，折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。

## 4. GitHub 风格引用警报（GFM Alerts）跨框架直通测试

以下三段在所有派生子模块中**保持母版原文一字不改**，用于检验零改造直通能力（实测：Python-Markdown 遵循早期 Gruber Markdown 而非 CommonMark 规范，不仅不识别 `> [!NOTE]` 语法，还会将空行分隔的连续三段 `>` 引用合并进**同一个 `<blockquote>` 内的三个 `<p>` 段落**并裸露 `[!NOTE]` 等标记字符串）：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本，用于检验各生成器对母版语法的零改造直通能力。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了母版文档的派生改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器（如 VuePress v1、Starlight 默认配置、Docsify v4 旧插件），上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。
