// Fetch products and render on the landing page and shop page
const productContainer = document.getElementById('product-container');
const categoriesList = document.getElementById('categories-list');

// Fetch and display products and categories
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        const products = data.products;
        const categories = [...new Set(products.map(product => product.category))];
        renderCategories(categories, products);
        renderFeaturedProducts(products.slice(0, 3)); // Display first 3 products as featured
    });

// Render categories and products
function renderCategories(categories, products) {
    categoriesList.innerHTML = '';

    categories.forEach(category => {
        const categoryProducts = products.filter(product => product.category === category).slice(0, 4); // Show 4 products per category
        let productCards = '';

        categoryProducts.forEach(product => {
            productCards += `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="card">
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">$${product.price.toFixed(2)}</p>
                            <a href="product.html?id=${product.id}" class="btn btn-primary">View Product</a>
                        </div>
                    </div>
                </div>
            `;
        });

        categoriesList.innerHTML += `
            <h3 class="mb-4">${category}</h3>
            <div class="row">${productCards}</div>
        `;
    });
}

// Render featured products
function renderFeaturedProducts(products) {
    const glideSlides = document.querySelector('.glide__slides');
    glideSlides.innerHTML = '';

    products.forEach(product => {
        glideSlides.innerHTML += `
            <li class="glide__slide">
                <div class="card">
                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <a href="product.html?id=${product.id}" class="btn btn-primary">View Product</a>
                    </div>
                </div>
            </li>
        `;
    });

    // Initialize Glide.js
    new Glide('.glide', {
        type: 'carousel',
        perView: 1,
        gap: 30,
        autoplay: 3000
    }).mount();
}

// Handle product details display on product.html
const productId = new URLSearchParams(window.location.search).get('id');
if (productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            document.getElementById('product-details').innerHTML = `
                <div class="card mb-4">
                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `;
        });
}

// Fetch and render all products in the shop page
if (window.location.pathname.includes('shop.html')) {
    fetch('https://dummyjson.com/products')
        .then(res => res.json())
        .then(data => {
            const shopProductsContainer = document.getElementById('shop-products');
            shopProductsContainer.innerHTML = '';

            data.products.forEach(product => {
                shopProductsContainer.innerHTML += `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div class="card">
                            <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">$${product.price.toFixed(2)}</p>
                                <a href="product.html?id=${product.id}" class="btn btn-primary">View Product</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        });
}


// Add product to cart
function addToCart(productId) {
    fetch(`https://dummyjson.com/products/${productId}`)
        .then(res => res.json())
        .then(product => {
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = cartItems.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartCount();
        });
}

// Update cart count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Display cart items on cart.html
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartContainer.innerHTML = '';
    let totalAmount = 0;

    cartItems.forEach(item => {
        const { id, title, thumbnail, price, quantity } = item;
        totalAmount += price * quantity;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${thumbnail}" alt="${title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h5>${title}</h5>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Quantity: ${quantity}</p>
                    <button class="btn btn-danger remove-item" data-id="${id}">Remove</button>
                </div>
            </div>
        `;
    });

    cartTotalElement.textContent = `$${totalAmount.toFixed(2)}`;
    updateCartCount(); // Also update the cart count in the navbar
}

// Display order summary on checkout page
function displayOrderSummary() {
    const orderSummaryContainer = document.getElementById('order-summary');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    orderSummaryContainer.innerHTML = '';
    let totalAmount = 0;

    cartItems.forEach(item => {
        const { title, thumbnail, price, quantity } = item;
        totalAmount += price * quantity;

        orderSummaryContainer.innerHTML += `
            <div class="order-item">
                <img src="${thumbnail}" alt="${title}" class="order-item-img">
                <div class="order-item-details">
                    <h5>${title}</h5>
                    <p>Price: $${price.toFixed(2)}</p>
                    <p>Quantity: ${quantity}</p>
                </div>
            </div>
        `;
    });

    orderSummaryContainer.innerHTML += `<h3>Total: $${totalAmount.toFixed(2)}</h3>`;
}

// Initialize checkout page
if (window.location.pathname.includes('checkout.html')) {
    displayOrderSummary();

    // Handle payment form submission
    document.getElementById('payment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Payment Successful!');
        localStorage.removeItem('cartItems'); // Clear cart after payment
        window.location.href = 'index.html'; // Redirect to home page
    });

    // Handle shipping form submission
    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Shipping Details Saved!');
    });
}


// Remove item from cart
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
        const itemId = e.target.getAttribute('data-id');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.id !== parseInt(itemId));
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
    }
});

// Initialize cart display
if (window.location.pathname.includes('cart.html')) {
    displayCartItems();
} else {
    updateCartCount();
}
