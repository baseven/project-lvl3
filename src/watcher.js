import onChange from 'on-change';
import {
  feedbackRender,
  feedsRender,
  postsRender,
  formRender,
} from './renderers/index';

const processStateHandler = (processState, elements, watchedState) => {
  switch (processState) {
    case 'filling': {
      formRender(elements, watchedState);
      feedbackRender(elements, watchedState);
      break;
    }
    case 'sending': {
      formRender(elements, watchedState);
      break;
    }
    case 'finished': {
      formRender(elements, watchedState);
      feedbackRender(elements, watchedState);
      feedsRender(elements, watchedState);
      postsRender(elements, watchedState);
      break;
    }
    default: {
      break;
    }
  }
};

export default (state, elements) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState': {
        processStateHandler(value, elements, watchedState);
        break;
      }
      default: {
        break;
      }
    }
  });

  return watchedState;
};
