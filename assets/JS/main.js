var BASE_URL = "https://6388b301a4bb27a7f78f1885.mockapi.io/api/products";

var cart = [];

var CART_LOCAL_NAME = "cart";

var productList = [];

function saveLocalStorage(name, value) {
  localStorage.setItem(name, JSON.stringify(value));
}

function getLocalStorageData(name) {
  if (!name) return;
  return JSON.parse(localStorage.getItem(name)) ?? [];
}

function formatMoney(price) {
  return Number(price).toLocaleString();
}

async function fetchStudentList() {
  productList = [];

  try {
    productList = await product.getAllProduct(BASE_URL);

    var productListData = productList.data;

    renderProductList(productListData);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Done");
  }
}

function renderProductList(productList) {
  if (!productList) return;

  var productRow = document.querySelector(".product__row");
  if (!productRow) return;

  var html = "";

  if (productList.length < 1) {
    alert("Sản phẩm trống!");
    return;
  }

  for (var i = 0; i < productList.length; i++) {
    var productItem = productList[i];
    html += `<div class="product__col col-lg-3">
        <div class="product__item" " >
          <div class="product__item-link-image">
            <div
              class="product__item-image"
              style="
                background-image: url('${productItem.img}');
              "
            ></div>
            <div class="product__item-cart">
              <button class="product__item-cart-btn" onclick=(handleAddToCart(${
                productItem.id
              })) data-id="${productItem.id}">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          <div class="product__item-info">
            <a href="#">${productItem.name}</a>
            <p class="product__item-des">
              ${productItem.desc}
            </p>
            <p class="product__item-price my-4">${formatMoney(
              productItem.price
            )} VNĐ</p>

            <div class="product__ranting d-flex">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
        </div>
      </div>`;
  }

  productRow.innerHTML = html;
}

function findIndexCart(id) {
  var cart = getLocalStorageData(CART_LOCAL_NAME);

  for (var i = 0; i < cart.length; i++) {
    var cartItem = cart[i];

    if (cartItem.product.id === id) return i;
  }
  return -1;
}

async function handleAddToCart(productId) {
  try {
    var promise = await product.getProductById(BASE_URL, productId);

    var productItem = promise.data;

    var cartItem = {
      product: {
        id: productItem.id,
        price: productItem.price,
        name: productItem.name,
        img: productItem.img,
      },
      quantity: 1,
    };

    // Nếu trong cart đã tồn tại thì ta ko push nữa , thay vào đó ta tăng quantity lên
    // Nếu productItem chưa có thì ta mới push vào
    var indexCart = findIndexCart(productId);
    if (indexCart < 0) cart.push(cartItem);
    else cart[indexCart].quantity = cart[indexCart].quantity += 1;

    // Save localStorage

    saveLocalStorage(CART_LOCAL_NAME, cart);

    renderCart(cart);

    showCartInfo();
  } catch (error) {
    console.log(error);
  }
}

function addToCart() {
  var productItemList = document.querySelectorAll(`.product__item`);

  productItemList.forEach(function (productItem) {
    productItem.addEventListener("click", function (e) {
      var addToCartBtn = e.target.closest(".product__item-cart-btn");

      // Tránh nổi bọt
      if (!addToCartBtn) return;
      var productId = addToCartBtn.dataset.id;

      handleAddToCart(productId);
    });
  });
}

async function handleFilterByType(typeValue) {
  try {
    productList = await product.getAllProduct(BASE_URL);

    var productListData = productList.data;

    var productListByType = [];

    for (var i = 0; i < productListData.length; i++) {
      var productItem = productListData[i];
      if (typeValue === "all" || typeValue === productItem.type.toLowerCase())
        productListByType.push(productItem);
    }

    renderProductList(productListByType);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Done");
  }
}

function filterByType() {
  var productFilter = document.querySelector("#productFilter");
  if (!productFilter) return;

  productFilter.addEventListener("change", function (e) {
    handleFilterByType(e.target.value.toLowerCase());
  });
}

function calcQuantityAndPrice(cartList) {
  if (!Array.isArray(cartList) || !cartList) cartList = cart;

  var quantity = 0;

  var totalPrice = 0;

  for (var i = 0; i < cartList.length; i++) {
    var cartItem = cartList[i];
    quantity += cartItem.quantity;
    totalPrice += cartItem.product.price * cartItem.quantity;
  }

  return [quantity, totalPrice];
}

function showCartInfo() {
  var headerCartNumEle = document.querySelector(".header__cart-number");
  var headerCartPriceEle = document.querySelector(".header__cart-price");

  if (!headerCartNumEle || !headerCartPriceEle) return;

  var cartList = getLocalStorageData(CART_LOCAL_NAME);

  // var quantity = 0;

  // var totalPrice = 0;

  // Kiểm tra cart có item chưa , nếu chưa thì ko làm gì cả

  var [quantity, totalPrice] = calcQuantityAndPrice(cartList);

  if (cartList.length < 1) {
    quantity = 0;
    totalPrice = `0`;
  }

  headerCartNumEle.textContent = quantity;
  headerCartPriceEle.textContent = `${totalPrice.toLocaleString()} VNĐ`;
}

// Render cart
function renderCart(cartList) {
  if (!cartList || !Array.isArray(cartList)) cartList = cart;

  var emptyCart = document.querySelector(".cart__menu-empty");
  var notEmptyCart = document.querySelector(".cart__menu-not-empty");
  var cartItemList = document.querySelector(".cart__menu-item-list");
  var cartTotalPrice = document.querySelector(".cart-menu-total-price");

  var [quantity, totalPrice] = calcQuantityAndPrice(cartList);

  var html = "";

  if (!emptyCart || !notEmptyCart || !cartItemList || !cartTotalPrice) return;

  // Nếu cart empty

  if (cartList.length < 1) {
    notEmptyCart.style.display = "none";
    emptyCart.style.display = "block";
    return;
  }

  notEmptyCart.style.display = "block";
  emptyCart.style.display = "none";

  for (var i = 0; i < cartList.length; i++) {
    var cartItem = cartList[i];
    html += `<div class="cart__menu-item" data-id="${cartItem.product.id}">
      <div class="row g-4">
        <div class="cart__menu-col col-lg-3">
          <div class="cart__menu-item-image">
            <img
              class="img-fluid"
              src="${cartItem.product.img}"
              alt=""
            />
          </div>
        </div>
        <div class="cart__menu-col col-lg-7">
          <div class="cart__menu-item-info">
            <h2>${cartItem.product.name}</h2>
          </div>
          <div class="cart__menu-item-quantity-price">
            <input
              type="number"
              name=""
              id="cartItemPrice"
              min="1"
              max="99"
              class="cart__menu-item-quantity"
              value="${cartItem.quantity}"
              onchange=(handleChangeQuantity(${cartItem.product.id},event))
            />
            <span>X</span>
            <p class="cart__menu-item-price">${formatMoney(
              cartItem.product.price
            )} VNĐ</p>
          </div>
        </div>
        <div class="cart__menu-col col-lg-2">
          <div class="cart__menu-item-remove">
            <button class="cart__menu-remove-btn" onclick=(handleDeleteCartItem(${
              cartItem.product.id
            })) >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }

  cartItemList.innerHTML = html;
  cartTotalPrice.textContent = `${totalPrice.toLocaleString()} VNĐ`;
}

function handleChangeQuantity(id, e) {
  if (!id) return;

  var cartList = getLocalStorageData(CART_LOCAL_NAME);

  if (cartList.length < 1) return;

  var index = findIndexCart(id.toString());
  if (index < 0) {
    alert(`ID: ${id} không tồn tại`);
    return;
  }

  cartList[index].quantity = e.target.value * 1;

  // Save localStorage
  saveLocalStorage(CART_LOCAL_NAME, cartList);

  // Render cart
  renderCart(cartList);
  // cart info

  showCartInfo();
}

function handleDeleteCartItem(id) {
  if (!id) return;

  if (cart.length < 1) return;

  var index = findIndexCart(id.toString());
  if (index < 0) {
    alert(`${id} không tồn tại!`);
    return;
  }

  cart.splice(index, 1);

  // save localStorage
  saveLocalStorage(CART_LOCAL_NAME, cart);

  // Render cart
  renderCart(cart);

  // Show cart info
  showCartInfo();
}

// Clear all item cart

function handleClearAllItemCart() {
  var cartList = getLocalStorageData(CART_LOCAL_NAME);
  if (cartList.length < 1) return;

  cartList.splice(0);

  // save local storage
  saveLocalStorage(CART_LOCAL_NAME, cartList);

  // render cart
  renderCart(cartList);

  // show cart info
  showCartInfo();
}

function clearAllItemCart() {
  var checkoutBtn = document.querySelector(".cart__menu-checkout-btn");
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener("click", handleClearAllItemCart);
}

window.addEventListener("load", async function () {
  await fetchStudentList();

  cart = getLocalStorageData(CART_LOCAL_NAME);

  filterByType();
  // addToCart();
  showCartInfo();

  renderCart(cart);
  clearAllItemCart();
});
