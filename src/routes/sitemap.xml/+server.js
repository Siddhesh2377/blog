import { site } from '$lib/config.js';
import { getPosts } from '$lib/posts.js';

export const prerender = true;

export async function GET() {
	const posts = await getPosts();

	const urls = [
		`<url><loc>${site.url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
		...posts.map(
			(p) =>
				`<url><loc>${site.url}/${p.slug}/</loc><lastmod>${p.date}</lastmod><priority>0.8</priority></url>`
		)
	].join('\n  ');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
}
