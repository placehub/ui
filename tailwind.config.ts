import { defineConfig } from 'windicss/helpers'

import form from './src/tailwindcss/shortcuts/form'

/**
 * https://maketintsandshades.com
 *
 * light  = 40% от базового цвета.
 * dark   = 20% от базового цвета.
 */
export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary:            '#33aaff',
        'primary-light':    '#85ccff',
        'primary-dark':     '#2988cc',
        secondary:          '#624875',
        'secondary-light':  '#a191ac',
        'secondary-dark':   '#4e3a5e',
        green:              '#4cda64',
        'green-light':      '#94e9a2',
        'green-dark':       '#3dae50',
        red:                '#ff2a3f',
        'red-light':        '#ff7f8c',
        'red-dark':         '#cc2232',
        yellow:             '#ffb100',

        gray:             '#a1abb2',
        'gray-dark':      '#81898e',
        'gray-light':     '#c7cdd1',
        'gray-lightest':  '#eceef0'
      },
    },
  },

  shortcuts: {
    ...form
  },
})