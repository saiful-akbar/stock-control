(function() {
  const body = document.querySelector('body');
  const preloader = document.getElementById('preloader');
  const cookie = document.cookie
    .split(';')
    .some(value => value.trim() === 'theme=dark');

  if (cookie) {
    body.classList.add('dark');
    preloader.classList.add('loader-dark');
  }
})();
