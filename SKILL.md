---
name: Meta Tags Generator CLI
description: Generate SEO meta tags, Open Graph, Twitter Cards. Validate existing tags. Bulk process HTML files. Free SEO tool.
tags: [seo, meta-tags, open-graph, twitter-cards, html, cli, marketing]
---

# Meta Tags Generator CLI

Generate perfect meta tags for SEO and social sharing.

**Open Graph. Twitter Cards. Schema.org. All in one.**

## Quick Start

```bash
npm install -g @lxgicstudios/meta-tags
```

```bash
# Generate meta tags
meta-tags generate --title "My Page" --description "Page description"

# Validate existing page
meta-tags validate https://example.com

# Bulk process HTML files
meta-tags inject ./pages/*.html --config meta.json
```

## What It Generates

### Basic SEO
- Title tag (optimized length)
- Meta description
- Canonical URL
- Robots directives

### Open Graph
- og:title, og:description
- og:image, og:url
- og:type, og:site_name

### Twitter Cards
- twitter:card
- twitter:title, twitter:description
- twitter:image
- twitter:site, twitter:creator

### Schema.org (JSON-LD)
- Article, Product, Organization
- BreadcrumbList
- FAQPage, HowTo

## Commands

```bash
# Interactive generator
meta-tags generate -i

# From JSON config
meta-tags generate --config page-meta.json

# Validate and suggest fixes
meta-tags validate index.html --fix

# Preview how it looks on social
meta-tags preview https://example.com

# Bulk inject into HTML
meta-tags inject ./build/*.html --config seo.json

# Extract existing tags
meta-tags extract https://example.com -o meta.json
```

## Config File Example

```json
{
  "title": "My Awesome Page",
  "description": "A great description under 160 chars",
  "image": "https://example.com/og.png",
  "url": "https://example.com/page",
  "type": "article"
}
```

## When to Use This

- Pre-launch SEO check
- Social share optimization
- Bulk meta tag updates
- SEO audits
- Content publishing workflows

---

**Built by [LXGIC Studios](https://lxgicstudios.com)**

🔗 [GitHub](https://github.com/lxgicstudios/meta-tags) · [Twitter](https://x.com/lxgicstudios)
