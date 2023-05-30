fetch('products.json')
  .then((response) => response.json())
  .then(({ products }) => {

    let productListHTML = '';

    products.forEach(product => {
      productListHTML += `
        <div>
          <span>${product.name} - $${product.price}</span>
          <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
      `;
    });

    const productListContainer = document.getElementById('product-list');
    productListContainer.innerHTML = productListHTML;

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', addToCart);
    });

    function addToCart({ target { dataset: { productId }}}) {
      // Handle product to cart
      console.log('Product added to cart:', productId);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });