Title: 嵌套子页 A：排序前缀与 URL 纯净度权衡
Order: 04.1
Parent: 04-directory
Slug: 01-order-and-url

# 嵌套子页 A：排序前缀与 URL 纯净度权衡

在母版目录 `docs/04-directory/nested/` 中，文件名使用 `01-order-and-url.md` 以保证在 Git 与代码编辑器中按阅读先后顺序排列。而在 Pelican 中，路由与文件名更是**完全解耦但双向可控**：

- 本页未手写 `URL` 与 `Save_as`，自动命中 `pelicanconf.py` 的 `PATH_METADATA` 规则，精准生成 `/pelican/04-directory/nested/01-order-and-url/`；
- 如果希望在不改动本地 `01-` 有序文件名的前提下抹除线上序号，只需在头部追加一行 `URL: 04-directory/nested/order-and-url/` 与 `Save_as: 04-directory/nested/order-and-url/index.html`——且因为内部互链使用 `{filename}./01-order-and-url.md` 指向源物理路径，修改目标页 `URL` 不会导致任何内部引用断链！

- [返回上级：《04. 目录结构与路由取舍》]({filename}../index.md)
- [下一篇：《嵌套子页 B：多级子目录与侧边栏同步机制》]({filename}./02-sidebar-sync.md)
