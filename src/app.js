import _ from 'lodash';
import axios from 'axios';
import i18n from 'i18next';
import { validate, proxyUrl } from './utils';
import parser from './parser';
import watcher from './watcher';
import resources from './locales';

const getInputValue = ({ target }, inputName) => {
  const formData = new FormData(target);
  const inputValue = formData.get(inputName);
  return inputValue;
};

const updateValidationState = (watchedState) => {
  const error = validate(watchedState);
  watchedState.form.valid = _.isEqual(error, null);
  watchedState.form.error = error;
};

const buildFeed = (title, description) => ({
  id: _.uniqueId(),
  title,
  description,
});

const buildPost = (feedId) => ({ title, description, link }) => ({
  id: _.uniqueId(),
  feedId,
  title,
  description,
  link,
});

const updateRssContentState = (watchedState, { title, description, items }) => {
  const feed = buildFeed(title, description);
  watchedState.feeds.push(feed);
  const posts = items.map(buildPost(feed.id));
  watchedState.posts.unshift(...posts);
};

export default async (element) => {
  await i18n.init({
    lng: 'en',
    debug: true,
    resources,
  });

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

  const elements = {
    form: element.querySelector('.rss-form'),
    submitButton: element.querySelector('[type="submit"]'),
    feedbackContainer: element.querySelector('.feedback'),
    feedsContainer: element.querySelector('.feeds'),
    postsContainer: element.querySelector('.posts'),
  };

  const watchedState = watcher(state, elements);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    //     watchedState.form.processState = 'sending';
    const url = getInputValue(e, 'url');
    watchedState.form.url = url;
    updateValidationState(watchedState);
    if (!watchedState.form.valid) {
      // убрать failed
      watchedState.form.processState = 'failed';
      watchedState.form.processState = 'filling';
      return;
    }
    // убрать sending
    watchedState.form.processState = 'sending';
    try {
      const response = await axios.get(proxyUrl(url));
      const data = parser(response);
      updateRssContentState(watchedState, data);
      watchedState.links.push(url);
      watchedState.form.processState = 'finished';
    } catch (err) {
      watchedState.form.error = i18n.t('errorMessages.network');
      // убрать failed
      watchedState.form.processState = 'failed';
    }

    watchedState.form.processState = 'filling';
  });
};
// http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk
// http://lorem-rss.herokuapp.com/feed?unit=second&interval=1
