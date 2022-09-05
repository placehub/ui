import { create } from '@storybook/theming';
import Logotype from './assets/logotype.png'

export default create({
  base: 'light',
  brandTitle: 'PlaceHub UI',
  brandUrl: 'https://ui.placehub.ru',
  brandImage: Logotype,
  brandTarget: '_self',
});