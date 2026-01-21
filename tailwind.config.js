/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Roboto',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        transparent: 'transparent',
        primary: '#4077a5',
        secondary: '#335f84',
        tertiary: '#4986b8',
        success: '#11866f',
        info: '#3498db',
        warning: '#f39c12',
        danger: '#e74c3c',
        coa: {
          blue: {
            dark: '#004987',
            medium: '#4077a5',
            light: '#a6bfd5',
          },
          green: {
            dark: '#aaad00',
            medium: '#bfc240',
            light: '#e1e2a6',
          },
        },
      },
      hocus: ["&:hover", "&:focus"],
    },
    variants: {
      extend: {
        backgroundColor: ["hover", "focus", "group-hover", "hocus"],
        textColor: ["hover", "focus", "group-hover", "hocus"],
        fontSize: ["hover", "focus", "group-hover", "hocus"],
        textDecoration: ["hover", "focus", "group-hover", "hocus"],
        opacity: ["hover", "focus", "group-hover", "hocus"],
      },
    },
  },
  plugins: [
		function ({ addVariant }) {
			addVariant("hocus", ["&:hover", "&:focus"]);
		},
	],
};
