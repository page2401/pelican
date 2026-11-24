Title: 嵌套子页 B：多级子目录与侧边栏同步机制
Order: 04.2
Parent: 04-directory
Slug: 02-sidebar-sync

# 嵌套子页 B：多级子目录与侧边栏同步机制

与自带侧边栏概念的文档专用生成器（MkDocs、Starlight、Docusaurus）不同，Pelican 内核只有一维列表 `pages`（默认设置 `PAGE_ORDER_BY = "basename"` 甚至只按纯文件名排序，会把深层目录里的 `01-order-and-url.md` 混排到根级的 `01-annotations.md` 旁边！）。

在本子站中，我们利用 Pelican 极度开放的任意元数据透传特性，在子页头部声明 `Parent: 04-directory` 与 `Order: 04.2`，再由 `theme/templates/base.html` 中的 Jinja2 过滤器 `selectattr("parent", "equalto", p.slug) | sort(attribute="order")` 动态组装出中文分组导航树——无需引入任何第三方插件即可避免孤岛页。

- [返回上一篇：《嵌套子页 A：排序前缀与 URL 纯净度权衡》]({filename}./01-order-and-url.md)
- [返回上级：《04. 目录结构与路由取舍》]({filename}../index.md)
