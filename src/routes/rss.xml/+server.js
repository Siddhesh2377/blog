import { site } from '$lib/config.js';
import { getPosts } from '$lib/posts.js';

export const prerender = true;

export async function GET() {
	const posts = await getPosts();

	const items = posts
		.map(
			(post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${site.url}/${post.slug}/</link>
      <description><![CDATA[${post.description || ''}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${site.url}/${post.slug}/</guid>
    </item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)} — Blog</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.tagline)}</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
}

function escapeXml(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
