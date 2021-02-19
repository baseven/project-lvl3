const buildPost = (itemElement) => {
  const postTitle = itemElement.querySelector('title').textContent;
  const postDescription = itemElement.querySelector('description').textContent;
  const postLink = itemElement.querySelector('link').textContent;

  return { postTitle, postDescription, postLink };
};

export default ({ data }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');

  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const itemElements = doc.querySelectorAll('item');
  const posts = Array.from(itemElements, buildPost);

  return { title, description, posts };
};
