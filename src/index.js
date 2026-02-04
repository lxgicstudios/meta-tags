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
    favicon = '',
    // New 2026 SEO fields
    faqItems = [],
    howToSteps = [],
    breadcrumbs = [],
    price = '',
    currency = 'USD',
    availability = 'InStock',
    rating = '',
    ratingCount = '',
    speakable = false,
    organization = null
  } = config;

  const {
    includeOG = true,
    includeTwitter = true,
    includeJsonLD = true,
    includeAICrawlerHints = false,
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

  // AI Crawler Hints (2026 best practice)
  if (options.includeAICrawlerHints) {
    lines.push('');
    lines.push(`<!-- AI Search Optimization -->`);
    lines.push(`<meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1">`);
    lines.push(`<!-- Allow AI crawlers: GPTBot, Claude-Web, CCBot -->`);
    lines.push(`<!-- Ensure robots.txt also allows these user agents -->`);
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
    siteName,
    faqItems = [],
    howToSteps = [],
    breadcrumbs = [],
    price,
    currency = 'USD',
    availability = 'InStock',
    rating,
    ratingCount,
    speakable,
    organization
  } = config;

  const schemas = [];

  // Article schema
  if (type === 'article') {
    const article = {
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
    
    // Add SpeakableSpecification for AI/voice assistants
    if (speakable) {
      article.speakable = {
        "@type": "SpeakableSpecification",
        "cssSelector": ["article", "h1", "h2", ".summary", ".key-points"]
      };
    }
    
    schemas.push(article);
  }

  // FAQ schema (high value for AI search citations)
  if (type === 'faq' || faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
  }

  // HowTo schema
  if (type === 'howto' || howToSteps.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": title,
      "description": description || undefined,
      "image": image || undefined,
      "step": howToSteps.map((step, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": step.name || `Step ${i + 1}`,
        "text": step.text || step
      }))
    });
  }

  // Product schema
  if (type === 'product' && price) {
    const product = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title,
      "description": description || undefined,
      "image": image || undefined,
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": currency,
        "availability": `https://schema.org/${availability}`
      }
    };
    
    if (rating && ratingCount) {
      product.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "reviewCount": ratingCount
      };
    }
    
    schemas.push(product);
  }

  // Organization schema
  if (type === 'organization' || organization) {
    const org = organization || {};
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": org.name || siteName || title,
      "url": org.url || url || undefined,
      "logo": org.logo || image || undefined,
      "sameAs": org.sameAs || undefined
    });
  }

  // Breadcrumb schema
  if (breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    });
  }

  // Default WebPage schema
  if (schemas.length === 0 || (type === 'website' && schemas.length === 0)) {
    const webpage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description || undefined,
      "url": url || undefined,
      "image": image || undefined
    };
    
    if (speakable) {
      webpage.speakable = {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", "h2", ".summary", "main p:first-of-type"]
      };
    }
    
    schemas.push(webpage);
  }

  // Return single schema or array
  return schemas.length === 1 ? schemas[0] : schemas;
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
