"""Pelican 4.12.0 configuration for page2401/pelican benchmark subsite."""

from __future__ import annotations

from pymdownx.superfences import fence_code_format

AUTHOR = "page2401"
SITENAME = "Pelican 4.12 基准实测子站"
SITESUBTITLE = "pelican@4.12.0 · Jinja2 3.1.6"
SITEURL = "/pelican"
RELATIVE_URLS = False

TIMEZONE = "Asia/Shanghai"
DEFAULT_LANG = "zh_cn"

# Treat all benchmark chapters under content/ as static Pages rather than dated blog Articles
PATH = "content"
ARTICLE_PATHS: list[str] = []
PAGE_PATHS = [""]
DIRECT_TEMPLATES: list[str] = []

# Derive clean directory URLs from file paths (instead of Unidecode-transliterating Chinese Titles),
# while directory index.md files override URL / Save_as explicitly in MultiMarkdown metadata.
SLUGIFY_SOURCE = "basename"
PATH_METADATA = r"(?P<path_no_ext>.*)\..*"
PAGE_URL = "{path_no_ext}/"
PAGE_SAVE_AS = "{path_no_ext}/index.html"
PAGE_ORDER_BY = "order"

# Disable all blog RSS/Atom feeds for pure static documentation output
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Custom Jinja2 documentation theme with zero external CDN requests
THEME = "theme"

# Python-Markdown + PyMdown Extensions pipeline
MARKDOWN = {
    "extension_configs": {
        "markdown.extensions.tables": {},
        "markdown.extensions.toc": {"permalink": False},
        "markdown.extensions.admonition": {},
        "markdown.extensions.codehilite": {
            "css_class": "highlight",
            "guess_lang": False,
        },
        "pymdownx.arithmatex": {
            "generic": True,
        },
        "pymdownx.superfences": {
            "custom_fences": [
                {
                    "name": "mermaid",
                    "class": "mermaid",
                    "format": fence_code_format,
                }
            ]
        },
        "pymdownx.details": {},
    },
    "output_format": "html5",
}

DELETE_OUTPUT_DIRECTORY = True
LOAD_CONTENT_CACHE = False
