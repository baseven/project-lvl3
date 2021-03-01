import _ from 'lodash';
import * as yup from 'yup';

const errorMessages = {
  duplicateUrl: 'RSS уже существует',
};

const schema = yup.string().required().url();

export default (watchedState) => {
  const { links } = watchedState;
  const { url } = watchedState.form;
  if (_.includes(links, url)) {
    return errorMessages.duplicateUrl;
  }

  try {
    schema.validateSync(url);
    return null;
  } catch (e) {
    return e.message;
  }
};
