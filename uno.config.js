import presetWebFonts from '@unocss/preset-web-fonts';

import transformerVariantGroup from '@unocss/transformer-variant-group';
import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetWind,
  transformerDirectives,
} from 'unocss';
import presetTheme from 'unocss-preset-theme';

export default defineConfig({
  presets: [
    presetUno(),

    presetAttributify(),
    presetWind(),
    presetTheme({
      theme: {
        dark: {
          colors: {
            primary: '#ffffff',
            text: '#ffffff',
            background: '#000000',
            btn: {
              background: '#03fc41',
              text: '#000000',
            },
          },
        },
        light: {
          colors: {
            primary: '#000000',
            text: '#000000',
            background: '#ffffff',
            btn: {
              background: '#439941',
              text: '#ffffff',
            },
          },
        },
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Roboto:400;500;700;900',
        mono: ['Fira Code:400;500;700;900', 'Fira Mono:400;500;700;900'],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: [
    ['wh-full', 'w-full h-full'],
    ['flex-center', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['flex-row', 'flex flex-row'],
    ['flex-row-center', 'flex flex-row items-center'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    ['flex-col-axis-center', 'flex flex-col items-center'],
    ['text-ellipsis', 'truncate'],
    ['text-standard', 'text-sm md:text-base'],
    ['text-standard-small', 'text-xs md:text-sm'],
    ['text-standard-big', 'text-base md:text-5'],
    ['text-base-normal', 'text-base leading-normal'],
    ['text-lg-relaxed', 'text-lg leading-relaxed'],
    ['text-xl-loose', 'text-xl leading-loose'],
  ],
  rules: [
    ['leading-none', { 'line-height': '1' }],
    ['leading-tight', { 'line-height': '1.25' }],
    ['leading-snug', { 'line-height': '1.375' }],
    ['leading-normal', { 'line-height': '1.5' }],
    ['leading-relaxed', { 'line-height': '1.625' }],
    ['leading-loose', { 'line-height': '2' }],
  ],
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      secondary: 'var(--secondary-color)',
      inverted: 'var(--inverted-color)',

      success: 'var(--success-color)',
      warning: 'var(--warning-color)',
      error: 'var(--error-color)',
      info: 'var(--info-color)',
    },
  },
});

