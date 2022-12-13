var productService = {
  createProduct: function (product) {
    return axios({
      url: "https://6388b301a4bb27a7f78f1885.mockapi.io/api/products",
      method: "POST",
      data: product,
    });
  },

  fetchProducts: function () {
    return axios({
      url: "https://6388b301a4bb27a7f78f1885.mockapi.io/api/products",
      method: "GET",
    });
  },

  deleteProduct: function (id) {
    return axios({
      url: "https://6388b301a4bb27a7f78f1885.mockapi.io/api/products/" + id,
      method: "DELETE",
    });
  },

  fetchProductsDetail: function (id) {
    return axios({
      url: "https://6388b301a4bb27a7f78f1885.mockapi.io/api/products/" + id,
      method: "GET",
    });
  },

  updateProduct: function (product) {
    return axios({
      url:
        "https://6388b301a4bb27a7f78f1885.mockapi.io/api/products/" +
        product.id,
      method: "PUT",
      // request body chỉ tồn tại ở POST, PUT, PATCH
      data: product,
    });
  },
};
