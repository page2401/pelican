Title: 04. 目录结构与路由取舍
Description: 实测 Pelican 4.12 的博客基因（articles vs pages）、Title 拼音化陷阱、显式 URL/Save_as 与 {filename} 内链机制。
Order: 04
Slug: 04-directory
Child_group: 嵌套子章节 (nested)
URL: 04-directory/
Save_as: 04-directory/index.html

# 04. 目录结构与路由取舍（Pelican 博客模型改造为文档树实录）

Pelican 诞生之初是为按时间流归档的**个人技术博客**设计的。将母版多级目录 `docs/04-directory/nested/` 迁入 Pelican 时，必须正面跨过四道标志性的架构鸿沟：

1. **博客双轨模型（`articles` vs `pages`）**：Pelican 默认将 `content/` 下的 Markdown 当作新闻文章（`ARTICLE_PATHS = [""]`），没有写 `Date:` 字段会直接报错跳过；同时 `DIRECT_TEMPLATES = ['index', 'tags', 'categories', 'authors', 'archives']` 会强行用文章列表页覆盖根 `output/index.html`。要构建纯粹的技术文档站，必须在 `pelicanconf.py` 中反转配置：`ARTICLE_PATHS = []`、`PAGE_PATHS = [""]`、`DIRECT_TEMPLATES = []`。
2. **默认 `Title` 汉语拼音转写陷阱（`SLUGIFY_SOURCE = "title"`）**：不同于现代文档框架按文件路径生成路由，Pelican 默认调用 `Unidecode` 从文章标题推导 `slug` 并输出到扁平的 `pages/{slug}.html`——例如《01. 专属标注与元数据》默认会变成惊人的 `/pages/01-zhuan-shu-biao-zhu-yu-yuan-shu-ju.html`！必须配置正则 `PATH_METADATA = r"(?P<path_no_ext>.*)\..*"` 配合 `PAGE_URL = "{path_no_ext}/"` 与 `PAGE_SAVE_AS = "{path_no_ext}/index.html"` 才能还原目录层级。
3. **目录首页 `index.md` 仍需显式 `URL` / `Save_as` 覆盖**：即便启用了 `{path_no_ext}/index.html`，`04-directory/index.md` 提取出的无后缀路径是 `04-directory/index`，若不在本页头部显式声明 `URL: 04-directory/` 与 `Save_as: 04-directory/index.html`，产物会多出一层冗余的 `/04-directory/index/`。
4. **`{filename}` 构建期链接指令与扁平 `pages` 列表**：直接写 `./nested/01-order-and-url.md` 不会被 Pelican 重写；必须加上 `{filename}` 前缀（如 `{filename}./nested/01-order-and-url.md`）触发构建期寻址与 `SITEURL` 拼接（代价是在 GitHub / VS Code 中无法直接点击跳转）。此外 `PagesGenerator` 默认将所有子目录拍平为一维 `pages` 列表，需配合自定义 `Order` + `Parent` 元数据在 Jinja2 模板中重建树形侧边栏。

## 嵌套子文档入口（采用 Pelican `{filename}` 内部链接协议）

- [进入子文档 A：排序前缀与 URL 纯净度权衡]({filename}./nested/01-order-and-url.md)
- [进入子文档 B：多级子目录与侧边栏同步机制]({filename}./nested/02-sidebar-sync.md)
