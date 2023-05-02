const headerUrl = '../html/header.html';

  fetch(headerUrl)
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const headerContent = parser.parseFromString(html, 'text/html').querySelector('header').innerHTML;
    document.getElementById('headerPrincipal').innerHTML = headerContent;
  });