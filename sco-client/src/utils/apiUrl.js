export default function apiUrl(path, query = []) {

  // Menghapus spasi pada awal dan akhir path & menambahkan "/" pada awal path jika tidak ada
  let newPath = path.trim();
  if (newPath.substr(0, 1) !== "/") {
    newPath = "/" + newPath;
  }

  // Mengambil parameter query dan merubahnya menjadi query string url
  let qs = "?";
  for (let i = 0; i < query.length; i++) {
    qs += Object.keys(query[i]).toString().trim() + "=" + Object.values(query[i]).toString().trim();
    if (i < query.length - 1) {
      qs += "&";
    }
  }

  // Menggabungkan path dengan query string jika ada
  let url = query.length > 0 ? newPath + qs : newPath;

  return "http://localhost:8000/api" + url.trim();
}
