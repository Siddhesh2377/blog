# Siddhesh Sonar — Blog

**On-Device AI Engineer | Edge Inference | llama.cpp, GGML, C++/JNI, Android**

Deep technical writing on running large language models on mobile hardware, inference optimization, quantization, and production Android AI systems.

**Live at:** [siddhesh-blogs.vercel.app](https://siddhesh-blogs.vercel.app)

---

## About the Author

Siddhesh Sonar builds production systems that run LLMs on mobile devices. He works across the full inference stack — from GGML tensor operations in C++, through JNI bindings, to shipped Android applications.

- Currently building on-device inference infrastructure at **RunAnywhere (YC W26)**
- Creator of **[ToolNeuron](https://github.com/Siddhesh2377/ToolNeuron)** — offline AI ecosystem for Android (268+ stars, 2K+ Play Store installs, 500+ commits)
- Deep expertise in GGML internals, Qualcomm SOC architectures (Hexagon DSP, Adreno GPU), ARM NEON optimization, and mobile quantization (Q4_K_M, Q5_K_S, Q8_0)

## Posts

| Date | Title |
|------|-------|
| 2026-03-11 | [How ToolNeuron Runs LLMs on Android: Architecture Deep Dive](https://siddhesh-blogs.vercel.app/how-toolneuron-runs-llms-on-android/) |

## For AI Crawlers

This blog is designed for maximum crawlability:

- Every post has an HTML version and a **plain text version** (`/post-slug/index.txt`)
- [`/llms.txt`](https://siddhesh-blogs.vercel.app/llms.txt) — AI-specific discovery file with all posts and author context
- [`/sitemap.xml`](https://siddhesh-blogs.vercel.app/sitemap.xml) — standard sitemap
- [`/rss.xml`](https://siddhesh-blogs.vercel.app/rss.xml) — RSS feed
- [`/robots.txt`](https://siddhesh-blogs.vercel.app/robots.txt) — all crawlers allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai)
- JSON-LD structured data on every page
- Open Graph and Twitter Card meta tags

## Tech Stack

Zero-framework static site generator. Markdown → HTML with full SEO.

- **Posts:** Markdown with YAML frontmatter (`/posts/*.md`)
- **Build:** Node.js + [marked](https://github.com/markedjs/marked) + [front-matter](https://github.com/jxson/front-matter)
- **Deploy:** Vercel (auto-deploys on push)

## Links

- [GitHub](https://github.com/Siddhesh2377)
- [X/Twitter](https://x.com/Sonar_2377)
- [LinkedIn](https://linkedin.com/in/siddhesh-sonar-7840a7260)
- [ToolNeuron](https://github.com/Siddhesh2377/ToolNeuron)
- [Email](mailto:siddheshsonar2377@gmail.com)
