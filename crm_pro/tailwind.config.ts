
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(142 76% 36%)',
					foreground: 'hsl(0 0% 98%)',
					50: 'hsl(138 76% 97%)',
					100: 'hsl(140 84% 92%)',
					200: 'hsl(141 78% 85%)',
					300: 'hsl(141 76% 73%)',
					400: 'hsl(141 69% 58%)',
					500: 'hsl(142 76% 36%)',
					600: 'hsl(142 72% 29%)',
					700: 'hsl(142 69% 24%)',
					800: 'hsl(142 65% 20%)',
					900: 'hsl(143 64% 17%)'
				},
				secondary: {
					DEFAULT: 'hsl(210 40% 96.1%)',
					foreground: 'hsl(222.2 47.4% 11.2%)'
				},
				destructive: {
					DEFAULT: 'hsl(0 84.2% 60.2%)',
					foreground: 'hsl(210 40% 98%)'
				},
				muted: {
					DEFAULT: 'hsl(210 40% 96.1%)',
					foreground: 'hsl(215.4 16.3% 46.9%)'
				},
				accent: {
					DEFAULT: 'hsl(210 40% 96.1%)',
					foreground: 'hsl(222.2 47.4% 11.2%)'
				},
				popover: {
					DEFAULT: 'hsl(0 0% 100%)',
					foreground: 'hsl(222.2 84% 4.9%)'
				},
				card: {
					DEFAULT: 'hsl(0 0% 100%)',
					foreground: 'hsl(222.2 84% 4.9%)'
				},
				sidebar: {
					DEFAULT: 'hsl(138 76% 97%)',
					foreground: 'hsl(143 64% 17%)',
					primary: 'hsl(142 76% 36%)',
					'primary-foreground': 'hsl(0 0% 98%)',
					accent: 'hsl(140 84% 92%)',
					'accent-foreground': 'hsl(143 64% 17%)',
					border: 'hsl(141 78% 85%)',
					ring: 'hsl(142 76% 36%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
