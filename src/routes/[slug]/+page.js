import { error } from '@sveltejs/kit';
import { getPost } from '$lib/posts.js';

export async function load({ params }) {
	const post = getPost(params.slug);
	if (!post) error(404, `Post not found: ${params.slug}`);
	return { post };
}
