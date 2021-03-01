export default ({ form, submitButton }, { form: { processState } }) => {
  const input = form.elements.url;
  if (processState === 'finished') {
    form.reset();
    input.focus();
    return;
  }

  submitButton.disabled = processState === 'sending';

  const method = processState === 'failed' ? 'add' : 'remove';
  input.classList[method]('is-invalid');
};
