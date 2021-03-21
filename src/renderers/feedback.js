import i18n from 'i18next';

export default ({ feedbackContainer }, { form: { error } }) => {
  if (error) {
    feedbackContainer.classList.add('text-danger');
    feedbackContainer.textContent = i18n.t(error);
    return;
  }

  if (feedbackContainer.classList.contains('text-danger')) {
    feedbackContainer.classList.remove('text-danger');
  }

  feedbackContainer.classList.add('text-success');
  feedbackContainer.textContent = i18n.t('processMessages.finished');
};
