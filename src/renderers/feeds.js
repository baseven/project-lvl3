export default ({ feedsContainer }, { feeds }) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');
  const h2 = document.createElement('h2');
  h2.textContent = 'Фиды';
  ul.append(h2);

  feeds.forEach(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
    li.append(h3);
    li.append(p);
    ul.append(li);
  });

  feedsContainer.innerHTML = '';
  feedsContainer.append(ul);
};
