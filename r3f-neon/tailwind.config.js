/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				neon: {
					green: '#39ff14',
					blue: '#00f7ff',
					pink: '#ff1cf7',
				},
			},
			boxShadow: {
				'neon-green': '0 0 20px rgba(57,255,20,0.6), 0 0 40px rgba(57,255,20,0.3)',
				'neon-blue': '0 0 20px rgba(0,247,255,0.6), 0 0 40px rgba(0,247,255,0.3)',
				'neon-pink': '0 0 20px rgba(255,28,247,0.6), 0 0 40px rgba(255,28,247,0.3)',
			},
			backdropBlur: {
				'xs': '2px',
			},
		},
	},
	plugins: [],
}

