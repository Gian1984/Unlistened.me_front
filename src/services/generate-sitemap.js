import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    const routesStringContent = routesMatch[1];

    // Split the routes string into individual route objects.
    // This regex attempts to split by '},' followed by a newline and optional whitespace,
    // assuming each route object is well-formed.
    const routeStrings = routesStringContent.split(/},\s*\n\s*{/);

    const routes = routeStrings.map(routeStr => {
      let cleanedRouteStr = routeStr.trim();
      if (!cleanedRouteStr.startsWith('{')) {
        cleanedRouteStr = `{${cleanedRouteStr}`;
      }
      if (!cleanedRouteStr.endsWith('}')) {
        cleanedRouteStr = `${cleanedRouteStr}}`;
      }

      // Replace property names with quoted keys to make it valid JSON-like
      cleanedRouteStr = cleanedRouteStr
        .replace(/(\w+):/g, '"$1":') // Quote keys like path: to "path":
        .replace(/'/g, '"')         // Replace single quotes with double quotes
        .replace(/(\/\*[\s\S]*?\*\/)/g, '') // Remove multi-line comments
        .replace(/\/\/.*$/gm, '')   // Remove single-line comments
        .replace(/component:\s*\w+,?/g, ''); // Remove component property entirely

      // For `meta: { requiresAuth: true }`
      cleanedRouteStr = cleanedRouteStr.replace(/"meta":\s*({[\s\S]*?}),?/g, (match, metaContent) => {
        return `"meta":${metaContent.replace(/(\w+):\s*(true|false)/g, '"$1":$2')}`;
      });

      try {
        return JSON.parse(cleanedRouteStr);
      } catch (parseError) {
        console.warn('Could not parse route string (ignoring component references):', cleanedRouteStr);
        // Fallback for more complex meta or unhandled cases
        // Attempt to extract basic path and name via regex if JSON.parse fails
        const pathMatch = cleanedRouteStr.match(/"path":"(.*?)"/);
        const nameMatch = cleanedRouteStr.match(/"name":"(.*?)"/);
        const redirectMatch = cleanedRouteStr.match(/"redirect":"(.*?)"/);
        const requiresAuthMatch = cleanedRouteStr.match(/"requiresAuth":true/);
        const requiresAdminMatch = cleanedRouteStr.match(/"requiresAdmin":true/);

        return {
          path: pathMatch ? pathMatch[1] : '',
          name: nameMatch ? nameMatch[1] : '',
          redirect: redirectMatch ? redirectMatch[1] : undefined,
          meta: {
            requiresAuth: !!requiresAuthMatch,
            requiresAdmin: !!requiresAdminMatch,
          }
        };
      }
    });

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
