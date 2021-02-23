const buildFeedback = (error) => {
  const textType = error ? 'text-danger' : 'text-success';
  const successMessage = 'RSS успешно загружен';
  const textContent = error ?? successMessage;

  const div = document.createElement('div');
  div.classList.add('feedback', textType);
  div.textContent = textContent;
  return div;
};

export default (form, error) => {
  const div = form.closest('div');
  const previousFeedback = div.querySelector('.feedback');
  previousFeedback.remove();
  const input = form.elements.url;
  input.classList.remove('is-invalid');

  if (error) {
    input.classList.add('is-invalid');
  }

  const feedback = buildFeedback(error);
  div.append(feedback);
};
