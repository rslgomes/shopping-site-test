let cart = [];

if (localStorage.getItem('CART_ITEMS')) {
  cart = JSON.parse(localStorage.getItem('CART_ITEMS'));
}

function updateCartTotal() {
  const cartTotalContainer = document.getElementById('cart-total');
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  cartTotalContainer.innerText = cartTotal.toFixed(2);
}

function displayCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  
  cart.forEach((item) => {
    const cartItem = document.createElement('li');
    cartItem.innerText = `${item.name} - $${item.price} x ${item.quantity}`;
    cartItemsContainer.appendChild(cartItem);
  });
}

function saveCartToLocalStorage() {
  localStorage.setItem('CART_ITEMS', JSON.stringify(cart));
}

function clearCart() {
  cart = [];
  saveCartToLocalStorage();

  updateCartTotal();
  displayCartItems();
}

function addClearCartListener() {
  const clearCartButton = document.getElementById('clear-cart');
  clearCartButton.addEventListener('click', () => clearCart());
}

function addToCart({ target: { dataset: { productId } } }, products) {
  const selectedProduct = products.find((product) => product.id === Number(productId));
  const existingCartItem = cart.find((item) => item.id === Number(productId));
  
  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else { 
   cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: 1,
    });
  }
  window.localStorage.setItem('CART_ITEMS', JSON.stringify(cart));
  
  displayCartItems();
  updateCartTotal();
}

function addAddToCartListeners(products) {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', (event) => addToCart(event, products));
  });
}

function displayProductList(productListHTML) {
  const productListContainer = document.querySelector('.product-list');
  productListContainer.innerHTML = productListHTML;
}

function renderProductImage(product) {
  return `
    <img 
      class="card-image" 
      src=${product.image} 
      alt="Avatar" 
      style="max-width:200px;max-height:200px;"
    >
  `;
}

function renderProductData(product) {
  return `
   <h3 class="product-name">${product.name}</h3>
    <p class="product-price">$${product.price}</p>
    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
  `;
}

function renderCard(product) {
  return `
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        ${renderProductImage(product)}
      </div>
      <div class="flip-card-back">
        ${renderProductData(product)}
      </div>
    </div>
  </div> 
  `;
}

function generateProductListHTML(products) {
  return products.reduce((productListHTML, product) => productListHTML + renderCard(product), '');
}

async function fetchProducts() {
  try {
    const response = await fetch('products.json');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function fetchAndDisplayProducts() {
  const products = await fetchProducts();
  const productListHTML = generateProductListHTML(products);
  displayProductList(productListHTML);
  addAddToCartListeners(products);
  addClearCartListener();
  saveCartToLocalStorage();
  updateCartTotal();
  displayCartItems();
}

fetchAndDisplayProducts();

/*
function fetchProducts() {
  return fetch('products.json')
  .then((response) => response.json())
  .then((data) => data.products)
  .catch((error) => {
    console.error('Error:', error);
    return [];
  });
}

fetchProducts()
.then((products) => {
  const productListHTML = generateProductListHTML(products);
  displayProductList(productListHTML);
  addAddToCartListeners(products);
});
*/
