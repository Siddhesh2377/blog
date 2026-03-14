<script>
	import { onMount } from 'svelte';

	let title = $state('');
	let description = $state('');
	let date = $state(new Date().toISOString().split('T')[0]);
	let tags = $state('');
	let content = $state('');
	let wordCount = $state(0);
	let readingTime = $state(0);
	let savedIndicator = $state('');

	$effect(() => {
		const words = content.split(/\s+/).filter(Boolean);
		wordCount = words.length;
		readingTime = Math.ceil(wordCount / 200);
	});

	function saveToLocal() {
		localStorage.setItem('blog-editor-draft', JSON.stringify({ title, description, date, tags, content }));
		savedIndicator = 'saved';
		setTimeout(() => (savedIndicator = ''), 1500);
	}

	function loadFromLocal() {
		const raw = localStorage.getItem('blog-editor-draft');
		if (!raw) return;
		try {
			const data = JSON.parse(raw);
			title = data.title || '';
			description = data.description || '';
			date = data.date || new Date().toISOString().split('T')[0];
			tags = data.tags || '';
			content = data.content || data.markdown || '';
		} catch {}
	}

	function getFullPost() {
		return `title: ${title}
description: ${description}
date: ${date}
tags: ${tags}
published: true
---
${content}`;
	}

	async function copyPost() {
		await navigator.clipboard.writeText(getFullPost());
		savedIndicator = 'copied';
		setTimeout(() => (savedIndicator = ''), 1500);
	}

	function downloadTxt() {
		const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		const blob = new Blob([getFullPost()], { type: 'text/plain' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = (slug || 'post') + '.txt';
		a.click();
		URL.revokeObjectURL(a.href);
	}

	function clearDraft() {
		if (confirm('Clear the draft?')) {
			title = '';
			description = '';
			date = new Date().toISOString().split('T')[0];
			tags = '';
			content = '';
			localStorage.removeItem('blog-editor-draft');
		}
	}

	function handleKeydown(e) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			saveToLocal();
		}
	}

	onMount(loadFromLocal);
</script>

<svelte:head>
	<title>Editor — Siddhesh Sonar</title>
</svelte:head>

<div class="container" style="padding-top: 40px; padding-bottom: 60px;">
	<nav>
		<a href="/">&larr; back</a>
	</nav>

	<h1 style="font-size: 1.2rem; margin: 20px 0 24px; color: var(--text-heading);">post editor</h1>

	<div class="fields">
		<label>title<br><input type="text" bind:value={title} placeholder="Post title..."></label>
		<label>description<br><input type="text" bind:value={description} placeholder="Short description..."></label>
		<div style="display: flex; gap: 12px;">
			<label style="flex:1;">date<br><input type="date" bind:value={date}></label>
			<label style="flex:1;">tags<br><input type="text" bind:value={tags} placeholder="tag1, tag2, tag3"></label>
		</div>
	</div>

	<textarea
		bind:value={content}
		onkeydown={handleKeydown}
		placeholder="Write your post in plain text...

Links: [link text](https://example.com)
Blank lines create new paragraphs.
That's it."
		rows="24"
	></textarea>

	<div class="editor-footer">
		<span style="color: var(--text-tertiary); font-size: 0.84rem;">
			{wordCount} words · {readingTime} min read
			{#if savedIndicator}
				· <span style="color: var(--accent);">{savedIndicator}</span>
			{/if}
		</span>
		<div style="display: flex; gap: 8px;">
			<button onclick={copyPost}>copy</button>
			<button onclick={downloadTxt}>download .txt</button>
			<button onclick={clearDraft} style="color: var(--text-tertiary);">clear</button>
		</div>
	</div>
</div>

<style>
	.fields {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 16px;
	}
	.fields label {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--text-tertiary);
		text-transform: lowercase;
	}
	.fields input {
		width: 100%;
		padding: 8px 10px;
		margin-top: 4px;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg);
		color: var(--text);
		font-family: inherit;
		font-size: 0.9rem;
		outline: none;
	}
	.fields input:focus {
		border-color: var(--accent);
	}
	textarea {
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg);
		color: var(--text);
		font-family: inherit;
		font-size: 0.95rem;
		line-height: 1.8;
		padding: 16px;
		outline: none;
		resize: vertical;
	}
	textarea:focus {
		border-color: var(--accent);
	}
	textarea::placeholder {
		color: var(--text-tertiary);
	}
	.editor-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12px;
		flex-wrap: wrap;
		gap: 8px;
	}
	button {
		padding: 6px 14px;
		border-radius: 6px;
		border: 1px solid var(--border);
		background: var(--bg);
		color: var(--text-secondary);
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 500;
		cursor: pointer;
	}
	button:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
