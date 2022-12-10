var product = {
  getAllProduct(url) {
    return axios({
      url,
      method: "GET",
    });
  },

  getProductById(url, id) {
    return axios({
      url: `${url}/${id}`,
      method: "GET",
    });
  },
};
