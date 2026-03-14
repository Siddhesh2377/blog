import { site } from '$lib/config.js';
import { getPosts } from '$lib/posts.js';

export const prerender = true;

export async function GET() {
	const posts = await getPosts();

	const body = `# ${site.title}
> ${site.tagline}

Siddhesh Sonar is an On-Device AI Engineer specializing in edge inference optimization.
He builds production systems that run large language models on mobile hardware.
Currently building at RunAnywhere (YC W26). Creator of ToolNeuron (268+ GitHub stars).

## Blog Posts
${posts.map((p) => `- [${p.title}](${site.url}/${p.slug}/): ${p.description || ''}`).join('\n')}

## Links
- GitHub: ${site.github}
- Twitter/X: ${site.twitter}
- LinkedIn: ${site.linkedin}
- ToolNeuron: https://github.com/Siddhesh2377/ToolNeuron
`;

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
}
