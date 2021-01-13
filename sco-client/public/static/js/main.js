(function () {
  const body = document.querySelector("body");
  const preloader = document.getElementById("preloader");
  const animation = document.getElementById("lds-ring");

  // Ambil value dari cookie
  const theme = document.cookie.split(";").some(value => value.trim() === "theme=dark");

  // Cek apakah theme bernilai true atau false
  if (theme) {
    body.classList.add("bg-dark");
    preloader.classList.add("bg-dark");
    animation.classList.add("secondary");
  }
})();
