import _ from 'lodash';
import onChange from 'on-change';
// import axios from 'axios';
import validate from './utils/validate';
import renderError from './renderers/renderError';

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
    console.log(state);
  });
};
