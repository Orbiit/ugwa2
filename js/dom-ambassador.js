/**
 * @param {string} tag - Tag name of the desired HTML element.
 * @param {Object} attributes - Extra enformation about the desired element.
 * @param {Array.<string>} [attributes.classes] - The element's class names.
 * @param {Object} [attributes.data] - The element's data attributes.
 * @param {Array.<(string|HTMLElement)>} [attributes.content] - The element's child nodes.
 * @returns {HTMLElement} - The created element.
 */
function createElement(tag, attributes) {
  let elem = document.createElement(tag);
  if (attributes.classes) attributes.classes.forEach(c => elem.classList.add(c));
  if (attributes.data) Object.keys(attributes.data).forEach(d => elem.dataset[d] = attributes.data[d]);
  if (typeof attributes.content === 'string') elem.appendChild(createElementFromHTML(attributes.content));
  else if (attributes.content)
    attributes.content.forEach(e => elem.appendChild(typeof e === 'string' ? document.createTextNode(e) : e));
  return elem;
}

/**
 * @param {string} html - The HTML.
 * @returns {DocumentFragment} - The elements.
 */
function createElementFromHTML(html) {
  let tempDiv = document.createElement('div'),
  fragment = document.createDocumentFragment();
  tempDiv.innerHTML = html;
  Array.from(tempDiv.childNodes).forEach(e => fragment.appendChild(e));
  return fragment;
}
