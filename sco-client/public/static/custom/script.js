(function() {
  const cookies = document.cookie;
  const isDarkMode = cookies.split(';').some(v => v.trim() === 'theme=dark');
  const body = document.querySelector('body');
  if (isDarkMode) body.classList.add('dark');
})();
