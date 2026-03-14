function parsePost(filename, raw) {
	const slug = filename.split('/').pop().replace('.txt', '');
	const parts = raw.split(/\n---\n/);
	if (parts.length < 2) return null;

	const header = parts[0];
	const body = parts.slice(1).join('\n---\n').trim();

	// Parse simple key: value header
	const meta = {};
	for (const line of header.split('\n')) {
		const i = line.indexOf(':');
		if (i === -1) continue;
		const key = line.slice(0, i).trim();
		let val = line.slice(i + 1).trim();
		if (key === 'tags') {
			val = val.split(',').map((t) => t.trim()).filter(Boolean);
		} else if (key === 'published') {
			val = val === 'true';
		}
		meta[key] = val;
	}

	if (meta.published === false) return null;

	const wordCount = body.split(/\s+/).filter(Boolean).length;
	const readingTime = Math.ceil(wordCount / 200);

	return { slug, body, readingTime, ...meta };
}

export async function getPosts() {
	const files = import.meta.glob('/posts/*.txt', { eager: true, query: '?raw', import: 'default' });

	const posts = [];
	for (const [path, raw] of Object.entries(files)) {
		const post = parsePost(path, raw);
		if (post) posts.push(post);
	}

	return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPost(slug) {
	const files = import.meta.glob('/posts/*.txt', { eager: true, query: '?raw', import: 'default' });
	const key = `/posts/${slug}.txt`;
	const raw = files[key];
	if (!raw) return null;
	return parsePost(key, raw);
}
