(function () {
  const cookies = document.cookie.split(";");
  const body = document.querySelector("body");
  const preloader = document.getElementById("preloader");
  const img = document.getElementById("preloader-animation");
  const cookieName = "theme=";

  cookies.map(cookie => {
    if (cookie.trim().slice(0, cookieName.length) == cookieName) {
      if (cookie.trim().slice(cookieName.length) == "dark") {
        body.classList.add("dark");
        preloader.classList.add("dark");
        img.attributes.src.value = "/static/animation/loader-dark.gif"
      }
    }
    return;
  });
})();
