const buildItem = (itemElement) => {
  const titleElement = itemElement.querySelector('title');
  const descriptionElement = itemElement.querySelector('description');
  const linkElement = itemElement.querySelector('link');

  return {
    title: titleElement.textContent,
    description: descriptionElement.textContent,
    link: linkElement.textContent,
  };
};

export default ({ data: { contents } }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'text/xml');

  const titleElement = doc.querySelector('title');
  const descriptionElement = doc.querySelector('description');
  const itemElements = doc.querySelectorAll('item');
  const items = Array.from(itemElements, buildItem);

  return {
    title: titleElement.textContent,
    description: descriptionElement.textContent,
    items,
  };
};
