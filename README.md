# meta-tags

Generate perfect meta tags for SEO. HTML meta, Open Graph, Twitter Cards, JSON-LD schema. Copy-paste ready.

## Installation

```bash
npm install -g @lxgicstudios/meta-tags
```

Or use directly:

```bash
npx @lxgicstudios/meta-tags -t "My Page" -d "Description"
```

## Usage

```bash
# Basic usage
meta-tags -t "My Website" -d "Welcome to my site" -u "https://example.com"

# With image for social sharing
meta-tags -t "Blog Post" -d "An amazing article" -i "https://example.com/image.jpg"

# Article type with author
meta-tags -t "How to Code" --type article --author "John Doe" --published "2024-01-15"

# From config file
meta-tags --config seo.json -o head.html
```

## Options

| Option | Description |
|--------|-------------|
| `-t, --title` | Page title (required) |
| `-d, --description` | Meta description |
| `-u, --url` | Canonical URL |
| `-i, --image` | OG/Twitter image URL |
| `-k, --keywords` | Keywords (comma-separated) |
| `--site-name` | Website name |
| `--twitter` | Twitter handle |
| `--type` | OG type: website, article, product |
| `--author` | Article author |
| `--published` | Published date (ISO format) |
| `--robots` | Robots directive |
| `--locale` | Locale (e.g., en_US) |

## Output Formats

```bash
# HTML (default)
meta-tags -t "Title" -d "Description"

# JSON
meta-tags -t "Title" --format json

# React (Helmet/Next.js)
meta-tags -t "Title" --format react

# Vue (useHead)
meta-tags -t "Title" --format vue
```

## Config File

Create `seo.json`:

```json
{
  "title": "My Website - Home",
  "description": "Welcome to my website. We do amazing things.",
  "url": "https://example.com",
  "image": "https://example.com/og-image.jpg",
  "siteName": "My Website",
  "twitter": "@myhandle",
  "type": "website",
  "locale": "en_US"
}
```

Then run:

```bash
meta-tags --config seo.json
```

## Example Output

```html
<!-- Primary Meta Tags -->
<title>My Website - Home</title>
<meta name="title" content="My Website - Home">
<meta name="description" content="Welcome to my website.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://example.com">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="My Website - Home">
<meta property="og:description" content="Welcome to my website.">
<meta property="og:url" content="https://example.com">
<meta property="og:image" content="https://example.com/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="My Website - Home">
<meta property="twitter:description" content="Welcome to my website.">
<meta property="twitter:image" content="https://example.com/og-image.jpg">

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "My Website - Home",
  "description": "Welcome to my website.",
  "url": "https://example.com"
}
</script>
```

## Programmatic Usage

```javascript
const { generate } = require('@lxgicstudios/meta-tags');

const html = generate({
  title: 'My Page',
  description: 'Page description',
  url: 'https://example.com',
  image: 'https://example.com/image.jpg'
});

console.log(html);
```

## Why meta-tags?

- **Complete** - All essential tags in one command
- **Framework support** - React, Vue, plain HTML
- **JSON-LD included** - Schema.org markup
- **Copy-paste ready** - Just paste into your `<head>`

---

**Built by [LXGIC Studios](https://lxgicstudios.com)**

🔗 [GitHub](https://github.com/lxgicstudios/meta-tags) · [Twitter](https://x.com/lxgicstudios)
