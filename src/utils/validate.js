import _ from 'lodash';
import * as yup from 'yup';

const errorMessages = {
  validation: {
    url: 'The URL has already been added',
  },
};

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

const isUrlNew = (newsList, url) => {
  if (_.size(newsList) === 0) {
    return true;
  }

  const news = _.find(newsList, ({ link }) => _.eq(link, url));
  return !!news;
};

const validate = (watchedState) => {
  const { newsList } = watchedState;
  const { url } = watchedState.form.fields;
  if (!isUrlNew(newsList, url)) {
    return errorMessages.validation;
  }

  try {
    schema.validateSync(watchedState.form.fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

export default validate;
