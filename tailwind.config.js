/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        primary: '#4077a5',
        secondary: '#335f84',
        tertiary: '#4986b8',
        success: '#11866f',
        info: '#3498db',
        warning: '#f39c12',
        danger: '#e74c3c',
        'coa-blue-dark': '#004987',
        'coa-blue-medium': '#4077a5',
        'coa-blue-light': '#a6bfd5',
        'coa-green-dark': '#aaad00',
        'coa-green-medium': '#bfc240',
        'coa-green-light': '#e1e2a6',
      },
    },
  },
  plugins: [],
};
