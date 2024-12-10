document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Chips", price: 2.5, stock: 10, image: "https://via.placeholder.com/80?text=Chips" },
        { id: 2, name: "Soda", price: 1.5, stock: 8, image: "https://via.placeholder.com/80?text=Soda" },
        { id: 3, name: "Candy", price: 1.0, stock: 15, image: "https://via.placeholder.com/80?text=Candy" },
        { id: 4, name: "Juice", price: 2.0, stock: 5, image: "https://via.placeholder.com/80?text=Juice" },
        { id: 5, name: "Water", price: 1.0, stock: 20, image: "https://via.placeholder.com/80?text=Water" },
        { id: 6, name: "Cookies", price: 2.8, stock: 12, image: "https://via.placeholder.com/80?text=Cookies" },
    ];

    const productList = document.getElementById('product-list');
    const selectionArea = document.getElementById('selection-area');
    const checkoutButton = document.getElementById('checkout-button');
    const paymentSection = document.getElementById('payment-section');
    const totalCostEl = document.getElementById('total-cost');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountButton = document.getElementById('apply-discount');
    const messageDisplay = document.getElementById('message-display');
    const finalMessage = document.getElementById('final-message');
    const dispatchMessage = document.getElementById('dispatch-message');

    let cart = [];
    let totalCost = 0;
    let discountApplied = false;

    // Sounds
    const clickSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
    const successSound = new Audio('https://www.soundjay.com/button/beep-06.wav');
    const errorSound = new Audio('https://www.soundjay.com/button/beep-10.wav');

    // Render products
    function renderProducts() {
        products.forEach(product => {
            const productEl = document.createElement('div');
            productEl.className = 'product';
            productEl.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <p>Stock: <span class="stock-count">${product.stock}</span></p>
                <input type="number" min="1" max="${product.stock}" value="1" class="quantity-input">
                <button class="add-to-cart" data-id="${product.id}">Add</button>
            `;
            productList.appendChild(productEl);
        });
    }

    // Update cart display
    function updateCart() {
        selectionArea.innerHTML = '';
        totalCost = 0;

        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <span>${item.product.name} x${item.quantity}</span>
                <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
            `;
            selectionArea.appendChild(itemEl);
            totalCost += item.product.price * item.quantity;
        });

        totalCostEl.textContent = totalCost.toFixed(2);
        checkoutButton.disabled = cart.length === 0;
        checkoutButton.classList.toggle('disabled', cart.length === 0);
    }

    // Add product to cart
    productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            clickSound.play();

            const productId = parseInt(event.target.dataset.id);
            const product = products.find(p => p.id === productId);
            const quantityInput = event.target.previousElementSibling;
            const quantity = parseInt(quantityInput.value);

            if (quantity > 0 && quantity <= product.stock) {
                const existingCartItem = cart.find(item => item.product.id === productId);

                if (existingCartItem) {
                    existingCartItem.quantity += quantity;
                } else {
                    cart.push({ product, quantity });
                }

                product.stock -= quantity;
                event.target.parentElement.querySelector('.stock-count').textContent = product.stock;
                updateCart();
                messageDisplay.textContent = `Added ${product.name} x${quantity} to your cart.`;
            } else {
                errorSound.play();
                messageDisplay.textContent = `Invalid quantity for ${product.name}.`;
            }
        }
    });

    // Apply discount code
    applyDiscountButton.addEventListener('click', () => {
        clickSound.play();

        const discountCode = discountCodeInput.value.trim();

        if (discountCode === "DISCOUNT30" && !discountApplied) {
            totalCost *= 0.7;
            totalCostEl.textContent = totalCost.toFixed(2);
            discountApplied = true;
            messageDisplay.textContent = "Discount applied successfully!";
        } else {
            messageDisplay.textContent = discountApplied
                ? "Discount code already used."
                : "Invalid discount code.";
        }
    });

    // Checkout
    checkoutButton.addEventListener('click', () => {
        clickSound.play();
        paymentSection.classList.remove('hidden');
        messageDisplay.textContent = "Processing payment...";
    });

    // Simulate payment
    paymentSection.addEventListener('click', (event) => {
        if (event.target.id === 'cash-payment' || event.target.id === 'gpay-payment') {
            const paymentMethod = event.target.id === 'cash-payment' ? "Cash" : "GPay";
            messageDisplay.textContent = "Processing payment...";

            setTimeout(() => {
                successSound.play();
                messageDisplay.textContent = `Payment successful using ${paymentMethod}. Dispensing products...`;
                paymentSection.classList.add('hidden');
                finalMessage.classList.remove('hidden');
                dispatchMessage.textContent = "Your products have been dispatched. Thank you!";
            }, 2000);
        }
    });

    // Exit
    document.getElementById('exit-button').addEventListener('click', () => {
        clickSound.play();
        location.reload();
    });

    // Initial render
    renderProducts();
});
