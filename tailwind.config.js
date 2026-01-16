/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx}'],
    theme: {
      extend: {
        colors: {
          transparent: 'transparent',
          coa: {
            darkBlue: '#004987',
            medBlue: '#4077a5',
            lightBlue: '#a6bfd5',
  
            darkGreen: '#aaad00',
            medGreen: '#bfc240',
            lightGreen: '#e1e2a6',
          },
  
          gray: {
            dark: '#222222',
            light: '#b4bcc2',
            lighter: '#ecf0f1',
            lightest: '#0000002e'
          },
  
          brand: {
            primary: '#4077a5',
            secondary: '#335f84',
            tertiary: '#4986b8',
            success: '#11866f',
            info: '#3498db',
            warning: '#f39c12',
            danger: '#e74c3c',
          },
        },
      },
    },
    plugins: [],
  };