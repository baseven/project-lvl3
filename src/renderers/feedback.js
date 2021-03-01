export default ({ feedbackContainer }, { form: { error } }) => {
  if (error) {
    feedbackContainer.classList.add('text-danger');
    feedbackContainer.textContent = error;
    return;
  }

  if (feedbackContainer.classList.contains('text-danger')) {
    feedbackContainer.classList.remove('text-danger');
  }

  feedbackContainer.classList.add('text-success');
  feedbackContainer.textContent = 'RSS успешно загружен';
};
