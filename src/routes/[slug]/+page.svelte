<script>
	import { site } from '$lib/config.js';

	let { data } = $props();
	const post = data.post;

	const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	// Convert plain text to HTML: paragraphs + links
	function renderText(text) {
		return text
			.split(/\n\n+/)
			.map((block) => {
				let html = block
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
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
