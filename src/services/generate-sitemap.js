import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesFilePath = path.resolve(__dirname, '../router/index.js');
const sitemapOutputPath = path.resolve(__dirname, '../../dist/sitemap.xml');
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

    const routesStringContent = routesMatch[1];

    // Split the routes string into individual route objects.
    // This regex attempts to split by '},' followed by a newline and optional whitespace,
    // assuming each route object is well-formed.
    const routeStrings = routesStringContent.split(/},\s*\n\s*{/);

    const routes = routeStrings.map(routeStr => {
      // Extract properties directly from the route string using regex
      const pathMatch = routeStr.match(/path:\s*['"`](.*?)['"`],?/);
      const nameMatch = routeStr.match(/name:\s*['"`](.*?)['"`],?/);
      const redirectMatch = routeStr.match(/redirect:\s*['"`](.*?)['"`],?/);
      const metaMatch = routeStr.match(/meta:\s*({[\s\S]*?}),?/);

      let meta = {};
      if (metaMatch && metaMatch[1]) {
        // Attempt to parse meta content, handling boolean values
        let metaContent = metaMatch[1].replace(/(\w+):\s*(true|false)/g, '"$1":$2');
        try {
          meta = JSON.parse(metaContent);
        } catch (e) {
          // Fallback for meta if JSON.parse fails, try to extract specific meta properties
          const requiresAuthMatch = metaContent.match(/requiresAuth:\s*true/);
          const requiresAdminMatch = metaContent.match(/requiresAdmin:\s*true/);
          meta = {
            requiresAuth: !!requiresAuthMatch,
            requiresAdmin: !!requiresAdminMatch,
          };
        }
      }

      return {
        path: pathMatch ? pathMatch[1] : '',
        name: nameMatch ? nameMatch[1] : '',
        redirect: redirectMatch ? redirectMatch[1] : undefined,
        meta: meta,
      };
    });

    const sitemapEntries = [];
    const lastModDate = new Date().toISOString(); // Current timestamp for lastmod

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

        let changefreq = 'monthly';
        let priority = '0.5';

        switch (routePath) {
          case '/':
            changefreq = 'daily';
            priority = '1.0';
            break;
          case '/search-results':
          case '/categories':
          case '/music':
            changefreq = 'weekly';
            priority = '0.8';
            break;
          case '/about':
          case '/terms':
          case '/privacy':
          case '/documentation':
            changefreq = 'monthly';
            priority = '0.7';
            break;
          case '/login':
          case '/signup':
          case '/forgot_password':
          case '/forbidden':
            changefreq = 'yearly';
            priority = '0.3';
            break;
        }

        sitemapEntries.push(
          `<url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
        );
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
