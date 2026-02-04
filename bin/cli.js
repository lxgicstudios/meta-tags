#!/usr/bin/env node

const fs = require('fs');
const { generate, generateFromConfig } = require('../src/index');

const args = process.argv.slice(2);

const HELP = `
meta-tags - SEO Meta Tag Generator (2026 Edition)

USAGE
  meta-tags [options]
  meta-tags --config config.json
  meta-tags --interactive

OPTIONS
  -t, --title <str>          Page title
  -d, --description <str>    Meta description
  -u, --url <str>            Canonical URL
  -i, --image <str>          OG image URL
  -k, --keywords <str>       Keywords (comma-separated)
  --site-name <str>          Site name
  --twitter <str>            Twitter handle (@username)
  --type <str>               Schema type: website, article, product, faq, howto, organization
  --author <str>             Article author
  --published <str>          Published date (ISO)
  --robots <str>             Robots directive
  --locale <str>             Locale (e.g., en_US)

ADVANCED SEO (2026)
  --ai-friendly              Add AI crawler optimization hints
  --speakable                Add SpeakableSpecification for voice/AI assistants
  --faq <file>               FAQ items JSON file [{question, answer}]
  --howto <file>             HowTo steps JSON file [{name, text}]
  --breadcrumbs <file>       Breadcrumb items JSON [{name, url}]
  --price <num>              Product price (requires --type product)
  --currency <str>           Currency code (default: USD)
  --rating <num>             Product rating (1-5)
  --rating-count <num>       Number of reviews

OUTPUT OPTIONS
  -o, --output <file>        Output to file
  --format <type>            Output: html (default), json, react, vue
  --no-og                    Skip Open Graph tags
  --no-twitter               Skip Twitter Card tags
  --no-jsonld                Skip JSON-LD schema
  --config <file>            Load config from JSON file

EXAMPLES
  meta-tags -t "My Page" -d "Description" -u "https://example.com"
  meta-tags --config seo.json -o head.html
  meta-tags -t "Blog Post" --type article --author "John Doe" --ai-friendly
  meta-tags -t "FAQ Page" --type faq --faq faq.json
  meta-tags -t "Tutorial" --type howto --howto steps.json --speakable

LXGIC Studios | https://lxgicstudios.com
`;

function getOption(flag, short, def = null) {
  const idx = args.indexOf(flag);
  const shortIdx = short ? args.indexOf(short) : -1;
  const i = idx !== -1 ? idx : shortIdx;
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
}

function hasFlag(flag, short) {
  return args.includes(flag) || (short && args.includes(short));
}

async function main() {
  if (args.length === 0 || hasFlag('-h', '--help') || args[0] === 'help') {
    console.log(HELP);
    process.exit(0);
  }

  // Check for config file
  const configFile = getOption('--config', '-c');
  let config;

  if (configFile) {
    try {
      config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
    } catch (e) {
      console.error(`Error reading config: ${e.message}`);
      process.exit(1);
    }
  } else {
    // Load JSON files for advanced schema types
    const faqFile = getOption('--faq', null);
    const howtoFile = getOption('--howto', null);
    const breadcrumbsFile = getOption('--breadcrumbs', null);

    let faqItems = [];
    let howToSteps = [];
    let breadcrumbs = [];

    if (faqFile) {
      try {
        faqItems = JSON.parse(fs.readFileSync(faqFile, 'utf-8'));
      } catch (e) {
        console.error(`Error reading FAQ file: ${e.message}`);
        process.exit(1);
      }
    }

    if (howtoFile) {
      try {
        howToSteps = JSON.parse(fs.readFileSync(howtoFile, 'utf-8'));
      } catch (e) {
        console.error(`Error reading HowTo file: ${e.message}`);
        process.exit(1);
      }
    }

    if (breadcrumbsFile) {
      try {
        breadcrumbs = JSON.parse(fs.readFileSync(breadcrumbsFile, 'utf-8'));
      } catch (e) {
        console.error(`Error reading breadcrumbs file: ${e.message}`);
        process.exit(1);
      }
    }

    config = {
      title: getOption('--title', '-t'),
      description: getOption('--description', '-d'),
      url: getOption('--url', '-u'),
      image: getOption('--image', '-i'),
      keywords: getOption('--keywords', '-k'),
      siteName: getOption('--site-name', null),
      twitter: getOption('--twitter', null),
      type: getOption('--type', null, 'website'),
      author: getOption('--author', null),
      published: getOption('--published', null),
      robots: getOption('--robots', null) || 'index, follow',
      locale: getOption('--locale', null, 'en_US'),
      // 2026 SEO additions
      faqItems,
      howToSteps,
      breadcrumbs,
      price: getOption('--price', null),
      currency: getOption('--currency', null, 'USD'),
      rating: getOption('--rating', null),
      ratingCount: getOption('--rating-count', null),
      speakable: hasFlag('--speakable', null)
    };
  }

  // Validate required fields
  if (!config.title) {
    console.error('Error: --title is required');
    process.exit(1);
  }

  const options = {
    includeOG: !hasFlag('--no-og', null),
    includeTwitter: !hasFlag('--no-twitter', null),
    includeJsonLD: !hasFlag('--no-jsonld', null),
    includeAICrawlerHints: hasFlag('--ai-friendly', null),
    format: getOption('--format', '-f', 'html')
  };

  try {
    const result = generate(config, options);
    const output = getOption('--output', '-o');

    if (output) {
      fs.writeFileSync(output, result);
      console.log(`✓ Meta tags written to ${output}`);
    } else {
      console.log(result);
    }

  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
