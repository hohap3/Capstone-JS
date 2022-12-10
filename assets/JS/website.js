function websiteMain() {
  // Sticky header

  function stickyHeader() {
    var headerEle = document.querySelector(".header");

    if (!headerEle) return;

    var sticky = headerEle.offsetTop;

    window.addEventListener("scroll", function () {
      if (this.window.scrollY > sticky) {
        headerEle.classList.add("sticky");
      } else headerEle.classList.remove("sticky");
    });
  }

  // Scroll to top

  function handleScrollToTop() {
    document.documentElement.scrollTop = 0;
  }

  function scrollToTop() {
    var scrollToTop = document.querySelector(".scrollToTop");
    if (!scrollToTop) return;

    var HEIGHT_TO_SHOW_BUTTON = 800;

    scrollToTop.addEventListener("click", function () {
      handleScrollToTop();
    });

    window.addEventListener("scroll", function () {
      if (this.window.scrollY > HEIGHT_TO_SHOW_BUTTON)
        scrollToTop.classList.add("d-block");
      else scrollToTop.classList.remove("d-block");
    });
  }

  function handleCartClose(cartModal, cartMenu) {
    cartModal.classList.remove("open");
    cartMenu.style.transform = "translateX(100%)";
    cartMenu.style.opacity = "0";
  }

  function handleCartOpen(cartModal, cartMenu) {
    cartModal.classList.add("open");
    cartMenu.style.transform = "translateX(0)";
    cartMenu.style.opacity = "1";
  }

  function cartShow() {
    var cartBtn = document.querySelector(".header__cart-button");
    var cartModal = document.querySelector(".cart__modal");
    var cartMenu = document.querySelector(".cart__menu");
    var cartOverlay = document.querySelector(".cart__overlay");
    var closeCartBtn = document.querySelector(".cart__menu-close");
    if (!cartBtn || !cartModal || !cartMenu || !cartOverlay || !closeCartBtn)
      return;

    // Close Cart
    cartOverlay.addEventListener("click", function () {
      // cartModal.classList.remove("open");
      // cartMenu.style.transform = "translateX(100%)";
      // cartMenu.style.opacity = "0";
      handleCartClose(cartModal, cartMenu);
    });

    closeCartBtn.addEventListener("click", function (e) {
      handleCartClose(cartModal, cartMenu);
    });

    // Open cart
    cartBtn.addEventListener("click", function (e) {
      // cartModal.classList.add("open");
      // cartMenu.style.transform = "translateX(0)";
      // cartMenu.style.opacity = "1";
      handleCartOpen(cartModal, cartMenu);
    });
  }

  cartShow();

  stickyHeader();
  scrollToTop();
}

websiteMain();
