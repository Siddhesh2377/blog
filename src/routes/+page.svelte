<script>
	import { site } from '$lib/config.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
	<meta name="author" content={site.author} />
	<link rel="canonical" href="{site.url}/" />
	<link rel="alternate" type="application/rss+xml" title="{site.title} RSS" href="{site.url}/rss.xml" />

	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.description} />
	<meta property="og:url" content="{site.url}/" />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@Sonar_2377" />
	<meta name="twitter:title" content={site.title} />

	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Blog",
		"name": site.title,
		"description": site.description,
		"url": site.url,
		"author": {
			"@type": "Person",
			"name": site.author,
			"jobTitle": "On-Device AI Engineer",
			"worksFor": { "@type": "Organization", "name": "RunAnywhere" },
			"url": site.github,
			"sameAs": [site.twitter, site.linkedin, site.github]
		}
	})}</script>`}
</svelte:head>

<div class="container">
	<header class="about">
		<h1>{site.author}</h1>
		<p>On-Device AI Engineer. Building at <a href="https://runanywhere.ai">RunAnywhere</a> (YC W26).</p>
		<p>I run large language models on phones — no server, no API, just native C++ and ARM silicon. Creator of <a href="https://github.com/Siddhesh2377/ToolNeuron">ToolNeuron</a>.</p>
		<p class="links">
			<a href={site.github}>github</a> ·
			<a href={site.twitter}>x/twitter</a> ·
			<a href={site.linkedin}>linkedin</a> ·
			<a href="mailto:{site.email}">email</a> ·
			<a href="/rss.xml">rss</a>
		</p>
	</header>

	<hr>

	<section class="posts">
		<h2>writing</h2>
		{#each data.posts as post}
			<div class="post-item">
				<a href="/{post.slug}/">{post.title}</a>
				<span class="post-meta">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {post.readingTime} min</span>
				{#if post.description}
					<p class="post-desc">{post.description}</p>
				{/if}
			</div>
		{/each}
	</section>

	<footer>
		{site.author} · on-device AI engineer
	</footer>
</div>
