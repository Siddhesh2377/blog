import { site } from '$lib/config.js';

export const prerender = true;

export async function GET() {
	const body = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml

# AI Crawlers welcome
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
