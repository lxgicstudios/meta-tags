/**
 * Generate meta tags from config
 */
function generate(config, options = {}) {
  const {
    title,
    description = '',
    url = '',
    image = '',
    keywords = '',
    siteName = '',
    twitter = '',
    type = 'website',
    author = '',
    published = '',
    modified = '',
    robots = 'index, follow',
    locale = 'en_US',
    themeColor = '',
    favicon = ''
  } = config;

  const {
    includeOG = true,
    includeTwitter = true,
    includeJsonLD = true,
    format = 'html'
  } = options;

  if (format === 'json') {
    return JSON.stringify(buildTagsObject(config, options), null, 2);
  }

  if (format === 'react') {
    return generateReact(config, options);
  }

  if (format === 'vue') {
    return generateVue(config, options);
  }

  // Default: HTML
  return generateHTML(config, options);
}

function generateHTML(config, options) {
  const {
    title,
    description,
    url,
    image,
    keywords,
    siteName,
    twitter,
    type,
    author,
    published,
    modified,
    robots,
    locale,
    themeColor,
    favicon
  } = config;

  const { includeOG, includeTwitter, includeJsonLD } = options;

  const lines = [];

  // Basic meta tags
  lines.push(`<!-- Primary Meta Tags -->`);
  lines.push(`<title>${escapeHTML(title)}</title>`);
  lines.push(`<meta name="title" content="${escapeAttr(title)}">`);
  
  if (description) {
    lines.push(`<meta name="description" content="${escapeAttr(description)}">`);
  }
  
  if (keywords) {
    lines.push(`<meta name="keywords" content="${escapeAttr(keywords)}">`);
  }
  
  if (author) {
    lines.push(`<meta name="author" content="${escapeAttr(author)}">`);
  }
  
  lines.push(`<meta name="robots" content="${robots}">`);
  
  if (url) {
    lines.push(`<link rel="canonical" href="${escapeAttr(url)}">`);
  }
  
  if (favicon) {
    lines.push(`<link rel="icon" href="${escapeAttr(favicon)}">`);
  }
  
  if (themeColor) {
    lines.push(`<meta name="theme-color" content="${escapeAttr(themeColor)}">`);
  }

  // Open Graph
  if (includeOG) {
    lines.push('');
    lines.push(`<!-- Open Graph / Facebook -->`);
    lines.push(`<meta property="og:type" content="${type}">`);
    lines.push(`<meta property="og:title" content="${escapeAttr(title)}">`);
    
    if (description) {
      lines.push(`<meta property="og:description" content="${escapeAttr(description)}">`);
    }
    
    if (url) {
      lines.push(`<meta property="og:url" content="${escapeAttr(url)}">`);
    }
    
    if (image) {
      lines.push(`<meta property="og:image" content="${escapeAttr(image)}">`);
    }
    
    if (siteName) {
      lines.push(`<meta property="og:site_name" content="${escapeAttr(siteName)}">`);
    }
    
    lines.push(`<meta property="og:locale" content="${locale}">`);

    // Article specific
    if (type === 'article') {
      if (published) {
        lines.push(`<meta property="article:published_time" content="${published}">`);
      }
      if (modified) {
        lines.push(`<meta property="article:modified_time" content="${modified}">`);
      }
      if (author) {
        lines.push(`<meta property="article:author" content="${escapeAttr(author)}">`);
      }
    }
  }

  // Twitter Card
  if (includeTwitter) {
    lines.push('');
    lines.push(`<!-- Twitter -->`);
    lines.push(`<meta property="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`);
    lines.push(`<meta property="twitter:title" content="${escapeAttr(title)}">`);
    
    if (description) {
      lines.push(`<meta property="twitter:description" content="${escapeAttr(description)}">`);
    }
    
    if (url) {
      lines.push(`<meta property="twitter:url" content="${escapeAttr(url)}">`);
    }
    
    if (image) {
      lines.push(`<meta property="twitter:image" content="${escapeAttr(image)}">`);
    }
    
    if (twitter) {
      const handle = twitter.startsWith('@') ? twitter : `@${twitter}`;
      lines.push(`<meta property="twitter:site" content="${handle}">`);
      lines.push(`<meta property="twitter:creator" content="${handle}">`);
    }
  }

  // JSON-LD
  if (includeJsonLD) {
    lines.push('');
    lines.push(`<!-- Schema.org JSON-LD -->`);
    const jsonLD = buildJsonLD(config);
    lines.push(`<script type="application/ld+json">`);
    lines.push(JSON.stringify(jsonLD, null, 2));
    lines.push(`</script>`);
  }

  return lines.join('\n');
}

function buildJsonLD(config) {
  const {
    title,
    description,
    url,
    image,
    type,
    author,
    published,
    modified,
    siteName
  } = config;

  if (type === 'article') {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description || undefined,
      "image": image || undefined,
      "url": url || undefined,
      "datePublished": published || undefined,
      "dateModified": modified || published || undefined,
      "author": author ? {
        "@type": "Person",
        "name": author
      } : undefined,
      "publisher": siteName ? {
        "@type": "Organization",
        "name": siteName
      } : undefined
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description || undefined,
    "url": url || undefined,
    "image": image || undefined
  };
}

function buildTagsObject(config, options) {
  return {
    basic: {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      author: config.author,
      robots: config.robots || 'index, follow',
      canonical: config.url
    },
    openGraph: options.includeOG !== false ? {
      type: config.type || 'website',
      title: config.title,
      description: config.description,
      url: config.url,
      image: config.image,
      siteName: config.siteName,
      locale: config.locale || 'en_US'
    } : null,
    twitter: options.includeTwitter !== false ? {
      card: config.image ? 'summary_large_image' : 'summary',
      title: config.title,
      description: config.description,
      image: config.image,
      site: config.twitter,
      creator: config.twitter
    } : null,
    jsonLD: options.includeJsonLD !== false ? buildJsonLD(config) : null
  };
}

function generateReact(config, options) {
  const tags = buildTagsObject(config, options);
  
  const lines = [
    `// React Helmet / Next.js Head meta tags`,
    `// Usage: Add these inside <Helmet> or <Head>`,
    ``,
    `<title>${config.title}</title>`,
    `<meta name="description" content="${config.description || ''}" />`,
  ];

  if (config.url) {
    lines.push(`<link rel="canonical" href="${config.url}" />`);
  }

  if (options.includeOG !== false) {
    lines.push(`<meta property="og:title" content="${config.title}" />`);
    lines.push(`<meta property="og:description" content="${config.description || ''}" />`);
    if (config.image) {
      lines.push(`<meta property="og:image" content="${config.image}" />`);
    }
  }

  if (options.includeTwitter !== false) {
    lines.push(`<meta name="twitter:card" content="${config.image ? 'summary_large_image' : 'summary'}" />`);
    lines.push(`<meta name="twitter:title" content="${config.title}" />`);
  }

  return lines.join('\n');
}

function generateVue(config, options) {
  const tags = buildTagsObject(config, options);
  
  return `// Vue 3 useHead() configuration
// Usage: import { useHead } from '@vueuse/head'

useHead({
  title: '${config.title}',
  meta: [
    { name: 'description', content: '${config.description || ''}' },
    { property: 'og:title', content: '${config.title}' },
    { property: 'og:description', content: '${config.description || ''}' },
    ${config.image ? `{ property: 'og:image', content: '${config.image}' },` : ''}
    { name: 'twitter:card', content: '${config.image ? 'summary_large_image' : 'summary'}' },
  ],
  ${config.url ? `link: [{ rel: 'canonical', href: '${config.url}' }]` : ''}
})`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = { generate, generateFromConfig: generate, buildJsonLD, buildTagsObject };
