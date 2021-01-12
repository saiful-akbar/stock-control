(function () {
  const body = document.querySelector("body");
  const preloader = document.getElementById("preloader");
  const img = document.getElementById("preloader-animation");

  // Ambil value dari cookie
  const theme = document.cookie.split(";").some(value => value.trim() === "theme=dark");

  // Cek apakah theme bernilai true atau false
  if (theme) {
    img.attributes.src.value = "/static/animation/loader-dark.gif";
    body.classList.add("dark");
    preloader.classList.add("dark");
  }
})();
