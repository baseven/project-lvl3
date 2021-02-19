import _ from 'lodash';
import * as yup from 'yup';

const errorMessages = {
  url: {
    message: 'The URL has already been added',
  },
};

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

const validate = (watchedState) => {
  const { links } = watchedState;
  const { url } = watchedState.form.fields;
  if (_.includes(links, url)) {
    return errorMessages;
  }

  try {
    schema.validateSync(watchedState.form.fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

export default validate;
