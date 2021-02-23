import _ from 'lodash';
import onChange from 'on-change';
import axios from 'axios';
import validate from './utils/validate';
import renderFeedback from './renderers/renderFeedback';
import renderFeeds from './renderers/renderFeeds';

import parser from './utils/parser';

const updateValidationState = (watchedState) => {
  const error = validate(watchedState);
  watchedState.form.valid = _.isEqual(error, null);
  watchedState.form.error = error;
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
      url: null,
      valid: true,
      error: null,
    },
    links: [],
    feeds: [],
    posts: [],
  };

  const form = document.querySelector('.rss-form');
  const submitButton = form.querySelector('[type="submit"]');

  const processStateHandler = (processState, watchedState) => {
    switch (processState) {
      case 'filling': {
        submitButton.disabled = false;
        break;
      }
      case 'sending': {
        submitButton.disabled = true;
        break;
      }
      case 'failed': {
        renderFeedback(form, watchedState.form.error);
        break;
      }
      case 'finished': {
        renderFeedback(form, watchedState.form.error);
        renderFeeds(watchedState.feeds);
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
        processStateHandler(value, watchedState);
        break;
      }
      default: {
        break;
      }
    }
  });

  // http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.url = url;
    updateValidationState(watchedState);
    if (!watchedState.form.valid) {
      watchedState.form.processState = 'failed';
      watchedState.form.processState = 'filling';
      return;
    }

    watchedState.form.processState = 'sending';
    try {
      // const = `https://hexlet-allorigins.herokuapp.com/get?url=${url}`;
      const response = await axios.get(url);
      watchedState.links.push(url);
      const data = parser(response);
      const { title, description, posts } = data;
      watchedState.feeds.push({ title, description });
      watchedState.posts.push({ posts });
      watchedState.form.processState = 'finished';
    } catch (err) {
      watchedState.form.error = errorMessages.network.error;
      watchedState.form.processState = 'failed';
      throw err;
    }

    watchedState.form.processState = 'filling';
    form.reset();
    form.elements.url.focus();
  });
};
