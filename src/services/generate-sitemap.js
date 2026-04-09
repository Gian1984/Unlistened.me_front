const fs = require('fs');
const path = require('path');

const routesFilePath = path.resolve(__dirname, '../router/index.js');
const sitemapOutputPath = path.resolve(__dirname, '../../../dist/sitemap.xml');
const baseUrl = 'https://www.unlistened.me/';

async function generateSitemap() {
  try {
    const routerContent = fs.readFileSync(routesFilePath, 'utf8');

    // Extract the routes array string
    const routesMatch = routerContent.match(/routes: \[([\s\S]*?)\]/);

    if (!routesMatch || !routesMatch[1]) {
      console.error('Could not find routes array in src/router/index.js');
      process.exit(1);
    }

    const routesString = `[${routesMatch[1]}]`;

    // A hacky way to parse JS object literal string into a JS object
    // This is generally unsafe but acceptable here as we control the source file.
    const routes = eval(`(${routesString})`);

    const sitemapEntries = [];

    for (const route of routes) {
      // Exclude routes that require authentication, are redirects, or are dynamic
      const isAuthProtected = route.meta && (route.meta.requiresAuth || route.meta.requiresAdmin);
      const isRedirect = route.redirect;
      const isDynamic = route.path.includes(':') || route.path.includes('*');

      if (!isAuthProtected && !isRedirect && !isDynamic) {
        let routePath = route.path;
        // Remove trailing slash if not root
        if (routePath.length > 1 && routePath.endsWith('/')) {
          routePath = routePath.slice(0, -1);
        }
        const fullUrl = `${baseUrl}${routePath.startsWith('/') ? routePath.substring(1) : routePath}`;
        sitemapEntries.push(`<url><loc>${fullUrl}</loc></url>`);
      }
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

    fs.mkdirSync(path.dirname(sitemapOutputPath), { recursive: true });
    fs.writeFileSync(sitemapOutputPath, sitemapXml, 'utf8');

    console.log(`Sitemap generated successfully at ${sitemapOutputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
