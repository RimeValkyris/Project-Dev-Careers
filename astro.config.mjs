// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// The Cloudflare Pages address. Update this if the project name differs or a custom domain is added.
	site: 'https://dev-pipeline-2026.pages.dev',
	integrations: [sitemap()],
	// No Markdown on this site; Shiki's inline styles would also conflict with the CSP below.
	markdown: { syntaxHighlight: false },
	// Content Security Policy, added to every page as a <meta> tag at build time.
	// Astro hashes its own inline scripts and styles into script-src / style-src,
	// so nothing else (injected or third-party) is allowed to run.
	// Headers a <meta> policy can't set (frame-ancestors etc.) live in public/_headers.
	security: {
		csp: {
			algorithm: 'SHA-256',
			directives: [
				"default-src 'self'",
				"img-src 'self' data:",
				"font-src 'self'",
				"connect-src 'self'",
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'self'",
				'upgrade-insecure-requests',
			],
		},
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Bricolage Grotesque',
			cssVariable: '--font-display',
			weights: ['500 800'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
