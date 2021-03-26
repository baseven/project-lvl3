import _ from 'lodash';
import axios from 'axios';
import i18n from 'i18next';
import { validate, proxyUrl } from './utils';
import parser from './parser';
import watcher from './watcher';
import resources from './locales';

const updateValidationState = (watchedState) => {
  const error = validate(watchedState);
  watchedState.form.valid = _.isEqual(error, null);
  watchedState.form.error = error;
};

const buildFeed = (title, description, url) => ({
  id: _.uniqueId(),
  title,
  description,
  url,
});

const buildPost = (feedId) => ({ title, description, link }) => ({
  id: _.uniqueId(),
  feedId,
  title,
  description,
  link,
});

const updatePosts = (watchedState, { items }, url) => {
  const { feeds, posts } = watchedState;
  const currentFeed = feeds.find((feed) => feed.url === url);
  const newItems = items.filter((item) => !posts.find((post) => post.link === item.link));
  const newPosts = newItems.map(buildPost(currentFeed.id));
  watchedState.posts.unshift(...newPosts);
};

const updateRssContent = (watchedState) => {
  const { links } = watchedState;
  if (_.size(links) !== 0) {
    links.forEach(async (url) => {
      const response = await axios.get(proxyUrl(url));
      const data = parser(response);
      updatePosts(watchedState, data, url);
    });
  }

  const timeout = 5000;
  setTimeout(() => {
    updateRssContent(watchedState);
  }, timeout);
};

const addRssContent = (watchedState, { title, description, items }, url) => {
  const feed = buildFeed(title, description, url);
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
  updateRssContent(watchedState);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.url = url;
    watchedState.form.processState = 'sending';
    updateValidationState(watchedState);
    if (!watchedState.form.valid) {
      watchedState.form.processState = 'filling';
      return;
    }

    try {
      const response = await axios.get(proxyUrl(url));
      const data = parser(response);
      addRssContent(watchedState, data, url);
      watchedState.links.push(url);
      watchedState.form.processState = 'finished';
    } catch (err) {
      watchedState.form.error = i18n.t('errorMessages.network');
    }

    watchedState.form.processState = 'filling';
  });
};
// http://feeds.bbci.co.uk/sport/football/rss.xml?edition=uk
// http://lorem-rss.herokuapp.com/feed?unit=second&interval=1
