/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				'game-bg': '#111827',
				'container-bg': '#1f2937',
				'cell-bg': '#374151',
				'cell-filled': '#3b82f6',
			},
		},
	},
	plugins: [],
};
