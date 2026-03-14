<script>
	import { site } from '$lib/config.js';
	import hljs from 'highlight.js/lib/core';
	import kotlin from 'highlight.js/lib/languages/kotlin';
	import cpp from 'highlight.js/lib/languages/cpp';
	import javascript from 'highlight.js/lib/languages/javascript';
	import python from 'highlight.js/lib/languages/python';
	import bash from 'highlight.js/lib/languages/bash';
	import java from 'highlight.js/lib/languages/java';

	hljs.registerLanguage('kotlin', kotlin);
	hljs.registerLanguage('cpp', cpp);
	hljs.registerLanguage('c', cpp);
	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('python', python);
	hljs.registerLanguage('py', python);
	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('sh', bash);
	hljs.registerLanguage('java', java);

	let { data } = $props();
	const post = data.post;

	const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function renderText(text) {
		// Extract code blocks, replace with placeholders
		const codeBlocks = [];
		const withPlaceholders = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
			const trimmed = code.trimEnd();
			let highlighted;
			if (lang && hljs.getLanguage(lang)) {
				highlighted = hljs.highlight(trimmed, { language: lang }).value;
			} else {
				highlighted = trimmed
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
			}
			const i = codeBlocks.length;
			codeBlocks.push(`<pre><code class="hljs">${highlighted}</code></pre>`);
			return `\x00CODE${i}\x00`;
		});

		// Process remaining text as paragraphs
		return withPlaceholders
			.split(/\n\n+/)
			.map((block) => {
				const trimmed = block.trim();
				if (!trimmed) return '';
				if (trimmed.startsWith('\x00CODE')) {
					const i = parseInt(trimmed.replace(/\x00CODE|\x00/g, ''));
					return codeBlocks[i];
				}
				let html = trimmed
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/`([^`]+)`/g, '<code>$1</code>')
					.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2">$1</a>')
					.replace(/\n/g, '<br>');
				return `<p>${html}</p>`;
			})
			.join('\n');
	}
</script>

<svelte:head>
	<title>{post.title} — {site.title}</title>
	<meta name="description" content={post.description || ''} />
	<meta name="author" content={site.author} />
	<link rel="canonical" href="{site.url}/{post.slug}/" />
	<link rel="alternate" type="application/rss+xml" title="{site.title} RSS" href="{site.url}/rss.xml" />

	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description || ''} />
	<meta property="og:url" content="{site.url}/{post.slug}/" />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content={site.title} />
	<meta property="article:author" content={site.author} />
	<meta property="article:published_time" content={post.date} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@Sonar_2377" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.description || ''} />

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "TechArticle",
		"headline": post.title,
		"description": post.description || '',
		"datePublished": post.date,
		"url": `${site.url}/${post.slug}/`,
		"author": {
			"@type": "Person",
			"name": site.author,
			"jobTitle": "On-Device AI Engineer",
			"worksFor": { "@type": "Organization", "name": "RunAnywhere" },
			"url": site.github
		}
	})}</script>`}
</svelte:head>

<div class="container">
	<nav>
		<a href="/">&larr; back</a>
	</nav>

	<article>
		<header class="post-header">
			<h1>{post.title}</h1>
			<p class="post-meta">{dateFormatted} / {post.readingTime} min read / {site.author}</p>
			{#if post.tags?.length}
				<p class="post-tags">{post.tags.join(', ')}</p>
			{/if}
		</header>

		<div class="content">
			{@html renderText(post.body)}
		</div>
	</article>

	<footer>
		<a href="/">all posts</a> · <a href={site.github}>github</a> · <a href={site.twitter}>x/twitter</a> · <a href="/rss.xml">rss</a>
	</footer>
</div>
