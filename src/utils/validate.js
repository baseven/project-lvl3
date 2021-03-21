import _ from 'lodash';
import * as yup from 'yup';

yup.setLocale({
  string: {
    url: () => 'errorMessages.url.validity',
    required: () => 'errorMessages.url.required',
  },
});

const schema = yup
  .string()
  .required()
  .url();

export default (watchedState) => {
  const { links } = watchedState;
  const { url } = watchedState.form;
  if (_.includes(links, url)) {
    return 'errorMessages.url.duplicate';
  }

  try {
    schema.validateSync(url);
    return null;
  } catch (e) {
    return e.message;
  }
};
