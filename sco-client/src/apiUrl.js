const apiUrl = (url, token = null) => {
  if (token !== null) {
    return `http://localhost:8000/api${url}?api_token=${token}`;
  }
  return `http://localhost:8000/api${url}`;
};

export default apiUrl;
