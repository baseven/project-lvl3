import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import validate from './utils/validate';
import renderError from './renderers/renderError';
import parser from './utils/parser';

const updateValidationState = (watchedState) => {
  const errors = validate(watchedState);
  watchedState.form.valid = _.isEqual(errors, {});
  watchedState.form.errors = errors;
};

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      fields: {
        url: '',
      },
      valid: true,
      errors: {},
    },
    links: [],
    feeds: [],
    newsList: [],
  };

  const form = document.getElementById('rss-form');
  const input = form.elements.url;
  const submitButton = form.querySelector('[type="submit"]');

  const processStateHandler = (processState) => {
    switch (processState) {
      case 'filling': {
        submitButton.disabled = false;
        break;
      }
      default: {
        break;
      }
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState': {
        processStateHandler(value);
        break;
      }
      case 'form.valid': {
        submitButton.disabled = !value;
        break;
      }
      case 'form.errors': {
        renderError(input, value);
        break;
      }
      default: {
        break;
      }
    }
  });

  input.addEventListener('input', ({ target: { value } }) => {
    watchedState.form.fields.url = value;
    updateValidationState(watchedState);
  });

  // http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.form.processState = 'sending';
    try {
      const { url } = watchedState.form.fields;
      // const = `https://hexlet-allorigins.herokuapp.com/get?url=${url}`;
      const response = await axios.get(url);
      watchedState.form.processState = 'finished';
      watchedState.links.push(url);
      const data = parser(response);
      const { title, description, posts } = data;
      watchedState.feeds.push({ title, description });
      watchedState.newsList.push({ posts });
      console.log(state);
    } catch (err) {
      // В реальных приложениях также требуется корректно обрабатывать сетевые ошибки
      watchedState.form.processError = errorMessages.network.error;
      watchedState.form.processState = 'failed';
      console.log(state);
      // здесь это опущено в целях упрощения приложения
      throw err;
    }
    // Обработка данных, например, отправка на сервер
    // watchedState.registrationForm.data
  });
};
