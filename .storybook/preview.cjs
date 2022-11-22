import 'virtual:windi.css'
import { app } from '@storybook/vue3'
import { Ripple, AxiosPlugin } from '../src'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

app.use(AxiosPlugin)
app.directive('ripple', Ripple)