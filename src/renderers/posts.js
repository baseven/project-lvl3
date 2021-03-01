const createInnerHtml = ({ title, link, id }) => {
  const a = `<a href="${link}" class="font-weight-bold" data-id="${id}" target="_blank" rel="noopener noreferrer">${title}</a>`;
  const button = `<button type="button" class="btn btn-primary btn-sm" data-id="${id}" data-toggle="modal" data-target="#modal">Просмотр</button>`;
  return `${a}${button}`;
};

export default ({ postsContainer }, { posts }) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  const h2 = document.createElement('h2');
  h2.textContent = 'Посты';
  ul.append(h2);

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    const innerHTML = createInnerHtml(post);
    li.innerHTML = innerHTML;
    ul.append(li);
  });

  postsContainer.innerHTML = '';
  postsContainer.append(ul);
};
