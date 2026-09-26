import type { APIRoute } from 'astro';

// Built from `site` in astro.config.mjs, so the sitemap link follows the real address.
export const GET: APIRoute = ({ site }) => {
	const sitemap = new URL('sitemap-index.xml', site);
	return new Response(`User-agent: *\nAllow: /\nDisallow: /downloads/\n\nSitemap: ${sitemap.href}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
