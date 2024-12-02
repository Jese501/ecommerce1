var removeCartItemButtons = document.getElementsByClassName('button-danger')
console.log(removeCartItemButtons)

for (var i = 0; i < removeCartItemButtons.length; i++){
    var button = removeCartItemButtons[i];
    button.addEventListener('click', function(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    })
}    
    
document.addEventListener('DOMContentLoaded', function() {
    function addToCart(event) {
        event.preventDefault();
        let productContainer = event.target.closest('.single-product');
        let name = productContainer.querySelector('h1').innerText;
        let price = productContainer.querySelector('h4').innerText;
        let quantity = parseInt(productContainer.querySelector('input[type=number]').value);
        let size = productContainer.querySelector('select').value;
        let image = productContainer.querySelector('#ProductImg').src;

        if (size === 'Select Size') {
            alert('Please select a size.');
            return;
        }

        let productKey = `${name}-${size}`;
        
        let product = {
            name: name,
            price: price,
            quantity: quantity,
            size: size,
            image: image
        };

        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};

        if (cart[productKey]) {
            cart[productKey].quantity += quantity;
        } else {
            cart[productKey] = product;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
        
        window.location.href = 'cart.html';
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('button')) {
            addToCart(event);
        }
    });

    if (document.querySelector('.small-container table')) {
        displayCartItems();
    }

    function displayCartItems() {
        let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
        let table = document.querySelector('.small-container table');
        let totalPrice = 0;

        let headerRow = table.querySelector('tr').cloneNode(true);
        table.innerHTML = '';
        table.appendChild(headerRow);

        for (let productKey in cart) {
            let product = cart[productKey];
            let row = document.createElement('tr');

            let productCell = document.createElement('td');
            let productInfo = document.createElement('div');
            productInfo.className = 'cart-info';

            let productImage = document.createElement('img');
            productImage.src = product.image;

            let productDetails = document.createElement('div');
            let productNameElement = document.createElement('p');
            productNameElement.innerText = `${product.name} (Size: ${product.size})`;
            let productPriceElement = document.createElement('small');
            productPriceElement.innerText = 'Price: ' + product.price;
            let removeButton = document.createElement('button');
            removeButton.className = 'button-danger';
            removeButton.innerHTML = '<a href="">Remove</a>';

            removeButton.addEventListener('click', function(event) {
                event.preventDefault();
                delete cart[productKey];
                localStorage.setItem('cart', JSON.stringify(cart));
                row.remove();
                alert('Product removed from cart!');
                updateTotalPrice();
            });

            productDetails.appendChild(productNameElement);
            productDetails.appendChild(productPriceElement);
            productDetails.appendChild(removeButton);
            productInfo.appendChild(productImage);
            productInfo.appendChild(productDetails);
            productCell.appendChild(productInfo);

            let quantityCell = document.createElement('td');
            let quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = product.quantity;
            quantityInput.name = 'quantity';
            quantityCell.appendChild(quantityInput);

            quantityInput.addEventListener('input', function() {
                let newQuantity = parseInt(quantityInput.value);
                if (newQuantity <= 0) {
                    quantityInput.value = product.quantity;
                    alert('Quantity must be at least 1');
                } else {
                    let subtotal = parseFloat(product.price.slice(1)) * newQuantity;
                    subtotalCell.innerText = 'P' + subtotal.toFixed(2);
                    product.quantity = newQuantity;
                    cart[productKey].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateTotalPrice();
                }
            });

            let subtotalCell = document.createElement('td');
            let subtotal = parseFloat(product.price.slice(1)) * product.quantity;
            subtotalCell.innerText = 'P' + subtotal.toFixed(2);
            totalPrice += subtotal;

            row.appendChild(productCell);
            row.appendChild(quantityCell);
            row.appendChild(subtotalCell);

            table.appendChild(row);
        }

        function updateTotalPrice() {
            let totalPrice = 0;
            for (let productKey in cart) {
                let product = cart[productKey];
                totalPrice += parseFloat(product.price.slice(1)) * product.quantity;
            }
            let totalCell = document.querySelector('.total-price td:last-child');
            totalCell.innerText = 'P' + totalPrice.toFixed(2);
        }

        updateTotalPrice();

        if (!document.querySelector('.checkout-button-container .button') && Object.keys(cart).length > 0) {
            let checkoutButtonContainer = document.querySelector('.checkout-button-container');
            let checkoutButton = document.createElement('a');
            checkoutButton.href = 'checkout.html';
            checkoutButton.className = 'button primary';
            checkoutButton.textContent = 'Checkout';
            checkoutButton.addEventListener('click', function() {
                if (Object.keys(cart).length === 0) {
                    alert('Your cart is empty!');
                } else {
                    alert('Order placed');
                    localStorage.removeItem('cart');
                    window.location.href = 'index.html';
                }
            });
            checkoutButtonContainer.appendChild(checkoutButton);
        }
    }
});
























