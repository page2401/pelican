Title: 05. 高阶代码块与语法高亮
Description: 实测 Pelican 4.12.0 下 Python-Markdown + pymdownx.superfences + Pygments 2.19.2 的代码块标题栏、hl_lines 行高亮、diff 着色与 === 缩进标签页。
Order: 05
Slug: 05-code-blocks
URL: 05-code-blocks/
Save_as: 05-code-blocks/index.html

# 05. 高阶代码块与语法高亮（Pelican `superfences` + Pygments `2.19.2`）

技术文档中超过 40% 的篇幅由代码块构成，但标准 CommonMark / GitHub Flavored Markdown **仅定义了围栏语言标识（```` ```ts ````）**，并未定义文件名标题栏、指定行高亮、带语法着色的行级 Diff 以及多语言 Tab 代码组。本文件由标准 GFM 母版派生适配至 **Pelican (`4.12.0`) + `pymdownx.superfences` (`13.1.2`) + Pygments (`2.19.2`)**。

## 1. 代码块文件名标题栏与基础语法高亮

Pelican 原生 `markdown.extensions.codehilite` 仅能识别围栏语言名，无法在围栏首行附加文件名标题；在 `pelicanconf.py` 中挂载 `pymdownx.superfences` 与 `pymdownx.highlight` 后，即可直接书写 `title="scripts/resolve-route.ts" hl_lines="3 7-9" linenums="1"`，在 Python 构建期一步直出 `<table class="highlighttable">` 标题栏、行号栏与 Pygments 静态词法类名（注：因 `pelican==4.12.0` 上游硬性声明 `pygments<2.20.0`，此处运行于锁定的 `pygments==2.19.2`）：

```ts title="scripts/resolve-route.ts" hl_lines="3 7-9" linenums="1"
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
```

## 2. 关键行聚焦与高亮（`hl_lines="3 7-9"`）

当需要在长配置中引导读者注意第 `3` 行与第 `7–9` 行时，Python-Markdown `superfences` + Pygments 采用空格分隔的 `hl_lines="3 7-9"` 属性，将目标行包裹进 `<span class="hll">...</span>` 节点，配合主题 CSS 即可呈现整行高亮：

```json title="bench.config.json" hl_lines="3 7-9" linenums="1"
{
  "id": "ssg-benchmark",
  "routeStyle": "clean",
  "strictZeroCdn": true,
  "markdown": {
    "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
```

## 3. 代码增删对比着色（Pygments `diff` 词法分析器）

标准 GFM 使用独立的 `diff` 语言标识表达补丁增删；Pygments `DiffLexer` 在构建期将 `-` 行编译为 `.gd`（Generic.Deleted）、`+` 行编译为 `.gi`（Generic.Inserted），零 JavaScript 呈现增删着色，但代价是失去了底层 TypeScript 语法分词：

```diff title="scripts/mount-subsite.patch"
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（`pymdownx.tabbed` 纯 CSS 单选标签组）

在 `pelicanconf.py` 的 `MARKDOWN["extension_configs"]` 中补充 `"pymdownx.tabbed": {"alternate_style": True}` 并补齐 `.tabbed-set` 样式规则后，Pelican 同样能复用 Python-Markdown 生态的 **`=== "标签"` + 4 空格缩进** 语法，以零运行时脚本渲染横向切换面板：

=== "Node.js"

    ```bash
    npm ci && npm run build
    ```

=== "Deno 2"

    ```bash
    deno task build
    ```

=== "Python"

    ```bash
    pip install -r requirements.txt && pelican content -o output -s pelicanconf.py
    ```

=== "Ruby"

    ```bash
    bundle install && bundle exec jekyll build
    ```

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress、Starlight、Fumadocs、Nextra、Rspress、Nuxt、Quartz | ✅ 纯静态内联样式 | ✅ `{1,3-5}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | Docusaurus、VuePress、Eleventy (plugin)、Gatsby | ✅ 静态 Token 类名 | ✅ `{1,3-5}` / 魔法注释 | ⚠️ 需配 diff-highlight 插件 |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、Zola (Rust Giallo)、mdBook (hljs) | ✅ (mdBook 为客户端 hljs) | ✅ Hugo/Zola 原生 `hl_lines` | ⚠️ 仅标准 `diff` 块红绿 |
