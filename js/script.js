const cart = [];

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

function generateProductListHTML(products) {
  let productListHTML = '';
  
  products.forEach((product) => {
    productListHTML += `
    <div>
    <span>${product.name} - $${product.price}</span>
    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
    `;
  });
  return productListHTML;
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
