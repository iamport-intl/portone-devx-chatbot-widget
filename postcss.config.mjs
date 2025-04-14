import prefixSelector from 'postcss-prefix-selector';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '.chat-widget-root-hgnj',
      transform: (prefix, selector, prefixedSelector, filePath, rule) => {
        if (filePath.includes('src/styles/globals.css')) {
            if (selector === prefix || selector === ':root') {
                return selector;
            }
            const pseudoElementMatch = selector.match(/::?(before|after|placeholder|scrollbar|scrollbar-track|scrollbar-thumb)$/);
            if (pseudoElementMatch) {
                return `${prefix} ${selector.replace(pseudoElementMatch[0], '')}${pseudoElementMatch[0]}`;
            }
            return `${prefix} ${selector}`;
        }
        return selector;
      },
    },
  },
};

export default config;
