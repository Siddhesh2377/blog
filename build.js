const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const fm = require('front-matter');

const POSTS_DIR = path.join(__dirname, 'posts');
const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATE_DIR = path.join(__dirname, 'templates');

const SITE = {
  title: 'Siddhesh Sonar',
  tagline: 'On-Device AI Engineer — Edge Inference, llama.cpp, GGML, Android',
  url: 'https://siddhesh-blogs.vercel.app',
  github: 'https://github.com/Siddhesh2377',
  twitter: 'https://x.com/Sonar_2377',
  linkedin: 'https://linkedin.com/in/siddhesh-sonar-7840a7260',
  email: 'siddheshsonar2377@gmail.com'
};

// Ensure dist directory
if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true });
fs.mkdirSync(DIST_DIR, { recursive: true });

// Read templates
const postTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'post.html'), 'utf-8');
const indexTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'index.html'), 'utf-8');

// Configure marked for code highlighting hints
marked.setOptions({
  gfm: true,
  breaks: false
});

// Parse all posts
const posts = fs.readdirSync(POSTS_DIR)
  .filter(f => f.endsWith('.md'))
  .map(filename => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
    const { attributes, body } = fm(raw);
    const slug = filename.replace('.md', '');
    const html = marked(body);
    return { ...attributes, slug, html, body, filename };
  })
  .filter(p => p.published !== false)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Build each post page
for (const post of posts) {
  const readingTime = Math.ceil(post.body.split(/\s+/).length / 200);
  const postDir = path.join(DIST_DIR, post.slug);
  fs.mkdirSync(postDir, { recursive: true });

  let page = postTemplate
    .replace(/\{\{title\}\}/g, post.title)
    .replace(/\{\{description\}\}/g, post.description || '')
    .replace(/\{\{date\}\}/g, post.date)
    .replace(/\{\{dateFormatted\}\}/g, new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
    .replace(/\{\{readingTime\}\}/g, readingTime)
    .replace(/\{\{tags\}\}/g, (post.tags || []).map(t => `<span class="tag">${t}</span>`).join(' '))
    .replace(/\{\{content\}\}/g, post.html)
    .replace(/\{\{slug\}\}/g, post.slug)
    .replace(/\{\{site\.url\}\}/g, SITE.url)
    .replace(/\{\{site\.title\}\}/g, SITE.title)
    .replace(/\{\{site\.twitter\}\}/g, SITE.twitter)
    .replace(/\{\{site\.github\}\}/g, SITE.github)
    .replace(/\{\{site\.linkedin\}\}/g, SITE.linkedin);

  fs.writeFileSync(path.join(postDir, 'index.html'), page);

  // Also write plain text version for AI crawlers
  const plainText = `${post.title}\nBy Siddhesh Sonar | ${post.date}\nTags: ${(post.tags || []).join(', ')}\n\n${post.body}`;
  fs.writeFileSync(path.join(postDir, 'index.txt'), plainText);
}

// Build index page
const postListHtml = posts.map(post => {
  const readingTime = Math.ceil(post.body.split(/\s+/).length / 200);
  return `
    <article class="post-card">
      <a href="/${post.slug}/">
        <h2>${post.title}</h2>
        <p class="post-meta">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · ${readingTime} min read</p>
        <p class="post-description">${post.description || ''}</p>
        <div class="post-tags">${(post.tags || []).map(t => `<span class="tag">${t}</span>`).join(' ')}</div>
      </a>
    </article>`;
}).join('\n');

let indexPage = indexTemplate
  .replace(/\{\{posts\}\}/g, postListHtml)
  .replace(/\{\{site\.title\}\}/g, SITE.title)
  .replace(/\{\{site\.tagline\}\}/g, SITE.tagline)
  .replace(/\{\{site\.url\}\}/g, SITE.url)
  .replace(/\{\{site\.github\}\}/g, SITE.github)
  .replace(/\{\{site\.twitter\}\}/g, SITE.twitter)
  .replace(/\{\{site\.linkedin\}\}/g, SITE.linkedin)
  .replace(/\{\{site\.email\}\}/g, SITE.email);

fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexPage);

// Copy public/ assets (images, etc.) to dist/
const PUBLIC_DIR = path.join(__dirname, 'public');
if (fs.existsSync(PUBLIC_DIR)) {
  const copyDir = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) copyDir(srcPath, destPath);
      else fs.copyFileSync(srcPath, destPath);
    }
  };
  copyDir(PUBLIC_DIR, DIST_DIR);
  console.log('Copied public/ assets to dist/');
}

// Build RSS feed
const rssItems = posts.map(post => `
  <item>
    <title>${post.title}</title>
    <link>${SITE.url}/${post.slug}/</link>
    <description><![CDATA[${post.description || ''}]]></description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <guid>${SITE.url}/${post.slug}/</guid>
  </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.title} — Blog</title>
    <link>${SITE.url}</link>
    <description>${SITE.tagline}</description>
    <language>en</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), rss);

// Build sitemap
const sitemapUrls = [
  `<url><loc>${SITE.url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
  ...posts.map(p => `<url><loc>${SITE.url}/${p.slug}/</loc><lastmod>${p.date}</lastmod><priority>0.8</priority></url>`)
].join('\n  ');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapUrls}
</urlset>`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);

// Build robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml

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
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots);

// Build llms.txt (AI-specific discovery file)
const llmsTxt = `# ${SITE.title}
> ${SITE.tagline}

Siddhesh Sonar is an On-Device AI Engineer specializing in edge inference optimization.
He builds production systems that run large language models on mobile hardware.
Currently building at RunAnywhere (YC W26). Creator of ToolNeuron (268+ GitHub stars).

## Blog Posts
${posts.map(p => `- [${p.title}](${SITE.url}/${p.slug}/): ${p.description || ''}`).join('\n')}

## Links
- GitHub: ${SITE.github}
- Twitter/X: ${SITE.twitter}
- LinkedIn: ${SITE.linkedin}
- ToolNeuron: https://github.com/Siddhesh2377/ToolNeuron
`;
fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsTxt);

console.log(`Built ${posts.length} posts to ${DIST_DIR}`);
console.log('Generated: index.html, rss.xml, sitemap.xml, robots.txt, llms.txt');
console.log('Each post also has a /index.txt for AI crawlers');
