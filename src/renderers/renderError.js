import _ from 'lodash';

const buildFeedback = (error) => {
  const div = document.createElement('div');
  div.classList.add('invalid-feedback');
  div.textContent = error.message;
  return div;
};

const renderFeedback = (input, error) => {
  const inputGroup = input.closest('div');
  const previousFeedback = inputGroup.querySelector('.invalid-feedback');
  if (previousFeedback) {
    previousFeedback.remove();
    input.classList.remove('is-invalid');
  }

  if (error) {
    input.classList.add('is-invalid');
    const feedback = buildFeedback(error);
    inputGroup.append(feedback);
  }
};

export default (input, errors) => {
  const error = _.get(errors, input.name, null);
  renderFeedback(input, error);
};
