export default ({ form, submitButton }, { form: { processState, error } }) => {
  const input = form.elements.url;
  if (processState === 'finished') {
    form.reset();
    input.focus();
    return;
  }

  submitButton.disabled = processState === 'sending';
  input.disabled = processState === 'sending';

  const method = error ? 'add' : 'remove';
  input.classList[method]('is-invalid');
};
