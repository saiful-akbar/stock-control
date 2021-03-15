(function() {
  const body = document.querySelector('body');
  const cookies = document.cookie;
  const isDarkMode = cookies.split(';').some(v => v.trim() === 'theme=dark');

  if (isDarkMode) {
    body.classList.add('dark');
  }
})();
