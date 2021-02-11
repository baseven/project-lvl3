import 'bootstrap';
import './scss/app.scss';
import app from './app';

export default () => {
  const element = document.getElementById('point');
  app(element);
};
