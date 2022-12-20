var productList = [];

var mode = "create";

function submitForm() {
  if (mode === "create") createProduct();
  else if (mode === "update") updateProduct();
}

async function createProduct() {
  // gửi request lên api
  var isValidate = validateForm();

  console.log(isValidate);
  //validate form
  if (!isValidate) return;
  try {
    // 1. DOM lấy input
    var id = document.getElementById("productId").value;
    var name = document.getElementById("productName").value;
    var price = document.getElementById("productPrice").value;
    var screen = document.getElementById("productScreen").value;
    var backCamera = document.getElementById("productBackCamera").value;
    var frontCamera = document.getElementById("productFrontCamera").value;
    var img = document.getElementById("productImg").value;
    var desc = document.getElementById("productDesc").value;
    var type = document.getElementById("productType").value;
    //2. tạo lớp đối tượng products
    var newProduct = new Product(
      id,
      name,
      price,
      screen,
      backCamera,
      frontCamera,
      img,
      desc,
      type
    );

    await productService.createProduct(newProduct);
    // alert("Thêm thành công");
    fetchProductsList();
  } catch (err) {
    console.log(err);
  }
}

function renderProducts(data) {
  data = data || productList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `
        <tr>
                <td>${data[i].id}</td>
                <td>${data[i].name}</td>
                <td>${data[i].price}</td>
                <td>${data[i].screen}</td>
                <td>${data[i].backCamera}</td>
                <td>${data[i].frontCamera}</td>
                <td>${data[i].img}</td>
                <td>${data[i].desc}</td>
                <td>${data[i].type}</td>
                <td class="action-event" >
                  <button 
                  onclick="deleteProduct(${data[i].id})"
                  class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                  <button 
                  onclick="getUpdateProduct(${data[i].id})"
                  data-bs-toggle="modal"
                  data-bs-target="#addProductModal"
                  class="btn btn-info"><i class="fa-solid fa-gears"></i></button>
                </td>
              </tr>
        `;
  }
  document.getElementById("tblProductsList").innerHTML = html;
}

// function saveProductList() {
//   //chuyển thành json
//   var productListJson = JSON.stringify(productList);
//   console.log(productListJson);
//   localStorage.setItem("SL", productListJson);
// }

// function getProductList() {
//   var productListJson = localStorage.getItem("SL");
//   if (!productListJson) return;
//   var productListLocal = JSON.parse(productListJson);
//   return productListLocal;
// }

async function fetchProductsList() {
  productList = [];
  renderProducts();

  document.getElementById("loader").classList.remove("d-none");
  document.getElementById("loader").classList.add("d-block");

  try {
    var res = await productService.fetchProducts();
    productList = mapProductList(res.data);
    renderProducts();
  } catch (err) {
    console.log(err);
  } finally {
    document.getElementById("loader").classList.remove("d-block");
    document.getElementById("loader").classList.add("d-none");
  }
}

function mapProductList(local) {
  var result = [];

  for (var i = 0; i < local.length; i++) {
    var oldProduct = local[i];
    var newProduct = new Product(
      oldProduct.id,
      oldProduct.name,
      oldProduct.price,
      oldProduct.screen,
      oldProduct.backCamera,
      oldProduct.frontCamera,
      oldProduct.img,
      oldProduct.desc,
      oldProduct.type
    );
    result.push(newProduct);
  }
  return result;
}

function deleteProduct(id) {
  Swal.fire({
    title: "Xóa sản phẩm",
    text: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Xác nhận",
    cancelButtonText: "Hủy",
  }).then(function (result) {
    if (result.isConfirmed) {
      productService
        .deleteProduct(id)
        .then(function (res) {
          console.log(res);
          fetchProductsList();
          Swal.fire({
            title: "Đã xóa",
            timer: 2000,
            icon: "success",
          });
        })
        .catch(function (err) {
          console.log(err);
          Swal.fire({
            title: "Error!",
            timer: 2000,
            icon: "error",
          });
        });
    }
  });
}

function getUpdateProduct(id) {
  productService
    .fetchProductsDetail(id)
    .then(function (res) {
      var product = res.data;
      document.getElementById("productId").value = product.id;
      document.getElementById("productName").value = product.name;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productScreen").value = product.screen;
      document.getElementById("productBackCamera").value = product.backCamera;
      document.getElementById("productFrontCamera").value = product.frontCamera;
      document.getElementById("productImg").value = product.img;
      document.getElementById("productDesc").value = product.desc;
      document.getElementById("productType").value = product.type;
      //disable mã sp
      document.getElementById("productId").disabled = true;
      //đổi mode = update
      mode = "update";
      document.getElementById("btnCreate").innerHTML = "Lưu thay đổi";
      document.getElementById("btnCreate").classList.add("btn-info");
      var btnCancel = document.getElementById("btnCancel");
      btnCancel.classList.remove("d-none");
      btnCancel.classList.add("d-block");
    })
    .catch(function (err) {
      console.log(err);
    });

  // try {
  //   var product = await productService.fetchProductsDetail(id).data;
  //   document.getElementById("productId").value = product.id;
  //   document.getElementById("productName").value = product.name;
  //   document.getElementById("productPrice").value = product.price;
  //   document.getElementById("productScreen").value = product.screen;
  //   document.getElementById("productBackCamera").value = product.backCamera;
  //   document.getElementById("productFrontCamera").value = product.frontCamera;
  //   document.getElementById("productImg").value = product.img;
  //   document.getElementById("productDesc").value = product.desc;
  //   document.getElementById("productType").value = product.type;
  //   //disable mã sp
  //   document.getElementById("productId").disabled = true;
  //   //đổi mode = update
  //   mode = "update";
  //   document.getElementById("btnCreate").innerHTML = "Lưu thay đổi";
  //   document.getElementById("btnCreate").classList.add("btn-info");
  //   var btnCancel = document.getElementById("btnCancel");
  //   btnCancel.classList.remove("d-none");
  //   btnCancel.classList.add("d-block");
  // } catch (err) {
  //   console.log(err);
  // }
}

function cancelUpdate() {
  mode = "create";

  //sửa button
  document.getElementById("btnCreate").innerHTML = "Thêm";
  document.getElementById("btnCreate").classList.remove("btn-info");
  document.getElementById("btnCreate").classList.add("btn-primary");
  document.getElementById("btnCancel").classList.remove("d-block");
  document.getElementById("btnCancel").classList.add("d-none");

  //reset form
  document.getElementById("form").reset();
  document.getElementById("productId").disabled = false;
}

function updateProduct() {
  var id = +document.getElementById("productId").value;
  var name = document.getElementById("productName").value;
  var price = +document.getElementById("productPrice").value;
  var screen = document.getElementById("productScreen").value;
  var backCamera = document.getElementById("productBackCamera").value;
  var frontCamera = document.getElementById("productFrontCamera").value;
  var img = document.getElementById("productImg").value;
  var desc = document.getElementById("productDesc").value;
  var type = document.getElementById("productType").value;

  var product = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  productService
    .updateProduct(product)
    .then(function (res) {
      alert("Cập nhật thành công");
      fetchProductsList();
      cancelUpdate();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findById(id) {
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].id === id) {
      return i;
    }
  }
  return -1;
}

window.onload = function () {
  fetchProductsList();
  // var productListFromLocal = getProductList();
  // productList = mapProductList(productListFromLocal);
  // renderProducts();
};

function searchProducts(e) {
  var keyword = e.target.value.toLowerCase().trim();
  var result = [];
  for (var i = 0; i < productList.length; i++) {
    var type = productList[i].type.toLowerCase();
    if (type.includes(keyword)) {
      result.push(productList[i]);
    }
  }
  renderProducts(result);
}

//validation
//check require
function required(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorProduct).innerHTML = "";
    return true;
  }

  document.getElementById(config.errorProduct).innerHTML =
    "*Không được để trống";
  return false;
}

//check pattern number
function patternNumber(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorProduct).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorProduct).innerHTML =
    "*Vui lòng chỉ nhập số";
  return false;
}

//check pattern link
function patternLink(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorProduct).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorProduct).innerHTML =
    "*Vui lòng nhập theo định dạng 'https://abc.xyz'";
  return false;
}

function validateForm() {
  var productId = document.getElementById("productId").value;
  var productName = document.getElementById("productName").value;
  var productPrice = document.getElementById("productPrice").value;
  var productScreen = document.getElementById("productScreen").value;
  var productBackCamera = document.getElementById("productBackCamera").value;
  var productFrontCamera = document.getElementById("productFrontCamera").value;
  var productImg = document.getElementById("productImg").value;
  var productDesc = document.getElementById("productDesc").value;
  var productType = document.getElementById("productType").value;

  var testRegexpNumber = /[0-9.]/g;
  var testRegexpLink =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  var idValid =
    required(productId, { errorProduct: "idError" }) &&
    patternNumber(productId, {
      errorProduct: "idError",
      regexp: testRegexpNumber,
    });

  var nameValid = required(productName, { errorProduct: "nameError" });
  required(productPrice, { errorProduct: "priceError" }) &&
    patternNumber(productPrice, {
      errorProduct: "priceError",
      regexp: testRegexpNumber,
    });

  var screenValid = required(productScreen, { errorProduct: "screenError" });

  var backCameraValid = required(productBackCamera, {
    errorProduct: "backCameraError",
  });

  var frontCameraValid = required(productFrontCamera, {
    errorProduct: "frontCameraError",
  });

  var imgValid =
    required(productImg, { errorProduct: "imgError" }) &&
    patternLink(productImg, {
      errorProduct: "imgError",
      regexp: testRegexpLink,
    });

  var descValid = required(productDesc, { errorProduct: "descError" });

  var typeValid = required(productType, { errorProduct: "typeError" });

  var isFormValid =
    idValid &&
    nameValid &&
    screenValid &&
    backCameraValid &&
    frontCameraValid &&
    imgValid &&
    descValid &&
    typeValid;
  return isFormValid;
}
