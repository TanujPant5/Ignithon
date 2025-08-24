// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Animate stats on scroll
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Animate dashboard cards on scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });

    // Initialize form validation
    initializeFormValidation();
});

// Counter animation for stats
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

// Show status message with animation
function showStatusMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
        element.className = `status-message ${type} show`;
        element.textContent = message;
        
        setTimeout(() => {
            element.classList.remove('show');
        }, 5000);
    }
}

// Show loading state
function showLoading(buttonElement) {
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.classList.add('loading');
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Processing...';
        
        return () => {
            buttonElement.disabled = false;
            buttonElement.classList.remove('loading');
            buttonElement.textContent = originalText;
        };
    }
}

// Farmer Portal Functions
function generateAIRecommendations() {
    const cropType = document.getElementById('crop-type').value;
    const fieldSize = document.getElementById('field-size').value;
    const recommendationsDiv = document.getElementById('ai-recommendations');
    
    if (!cropType || !fieldSize) {
        showStatusMessage('ai-recommendations', 'Please select crop type and enter field size.', 'error');
        return;
    }

    const button = event.target;
    const stopLoading = showLoading(button);

    // Simulate AI processing
    setTimeout(() => {
        const recommendations = getAIRecommendations(cropType, fieldSize);
        
        recommendationsDiv.innerHTML = `
            <h4>🤖 AI Recommendations for ${fieldSize} acres of ${cropType}</h4>
            <ul>
                ${recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
            </ul>
        `;
        recommendationsDiv.classList.add('show');
        
        stopLoading();
    }, 2000);
}

function getAIRecommendations(cropType, fieldSize) {
    const recommendations = {
        wheat: [
            `Optimal planting density: ${Math.round(fieldSize * 35)} kg/acre`,
            'Best planting time: Early fall for winter wheat',
            'Recommended fertilizer: 2.5 tons organic compost per acre',
            'Irrigation: Deep watering twice weekly during grain filling',
            'Pest management: Monitor for aphids and rust diseases'
        ],
        corn: [
            `Plant population: ${Math.round(fieldSize * 30000)} plants per acre`,
            'Soil temperature should be above 50°F for planting',
            'Nitrogen requirement: 1.2 lbs per bushel of expected yield',
            'Side-dress nitrogen when plants are 6-8 inches tall',
            'Monitor for corn borer and armyworm'
        ],
        rice: [
            'Water depth: Maintain 2-4 inches during growing season',
            'Seed rate: 80-100 lbs per acre for direct seeding',
            'Fertilizer: Apply phosphorus before flooding',
            'Weed control: Shallow flooding helps suppress weeds',
            'Harvest when moisture content is 20-25%'
        ],
        tomatoes: [
            `Plant spacing: ${Math.round(fieldSize * 2700)} plants per acre`,
            'Soil pH: Maintain between 6.0-6.8',
            'Mulching: Use organic mulch to retain moisture',
            'Support: Install stakes or cages early',
            'Disease prevention: Ensure good air circulation'
        ],
        lettuce: [
            'Plant every 2 weeks for continuous harvest',
            'Soil temperature: 60-65°F for optimal growth',
            'Water regularly but avoid overhead irrigation',
            'Harvest in early morning for best quality',
            'Watch for aphids and downy mildew'
        ]
    };

    return recommendations[cropType] || ['Please select a valid crop type for recommendations.'];
}

function listProduce() {
    const name = document.getElementById('produce-name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const listElement = document.getElementById('listed-produce');
    
    if (!name || !quantity || !price) {
        showStatusMessage('listed-produce', 'Please fill in all fields to list your produce.', 'error');
        return;
    }

    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        // Create new product for the market
        const newProduct = {
            id: Date.now(),
            name: name,
            farmerName: 'Your Farm',
            description: `Fresh ${name.toLowerCase()} from local farm.`,
            quantity: parseInt(quantity),
            price: parseFloat(price),
            category: getCategoryFromName(name),
            location: 'Local Farm',
            image: getEmojiForProduce(name)
        };
        
        // Add to farmer products storage
        farmerProducts.push(newProduct);
        localStorage.setItem('farmerProducts', JSON.stringify(farmerProducts));
        
        // Display in farmer dashboard
        const produceItem = document.createElement('div');
        produceItem.className = 'produce-item';
        produceItem.innerHTML = `
            <div class="produce-info">
                <h4>${name}</h4>
                <p>Quantity: ${quantity} kg • Price: ₹${price}/kg</p>
                <p>Total Value: ₹${(quantity * price).toFixed(0)}</p>
                <p>Status: <span style="color: var(--success);">Listed in Market</span></p>
            </div>
            <button class="btn btn-secondary" onclick="removeProduceItem(this, ${newProduct.id})">Remove</button>
        `;
        
        listElement.appendChild(produceItem);
        
        // Clear form
        document.getElementById('produce-name').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
        
        showStatusMessage('listed-produce', 'Produce listed successfully! It\'s now available in the market for buyers.', 'success');
        stopLoading();
    }, 1000);
}

function getCategoryFromName(name) {
    const vegetables = ['tomato', 'carrot', 'lettuce', 'cabbage', 'spinach', 'broccoli', 'cucumber', 'pepper'];
    const fruits = ['apple', 'orange', 'banana', 'grape', 'strawberry', 'peach', 'pear', 'cherry'];
    const grains = ['wheat', 'rice', 'corn', 'barley', 'oats'];
    const herbs = ['basil', 'cilantro', 'parsley', 'mint', 'oregano', 'thyme'];
    
    const lowerName = name.toLowerCase();
    
    if (vegetables.some(veg => lowerName.includes(veg))) return 'vegetables';
    if (fruits.some(fruit => lowerName.includes(fruit))) return 'fruits';
    if (grains.some(grain => lowerName.includes(grain))) return 'grains';
    if (herbs.some(herb => lowerName.includes(herb))) return 'herbs';
    
    return 'vegetables'; // default
}

function getEmojiForProduce(name) {
    const emojiMap = {
        tomato: '🍅', apple: '🍎', carrot: '🥕', lettuce: '🥬', 
        banana: '🍌', orange: '🍊', wheat: '🌾', corn: '🌽',
        potato: '🥔', onion: '🧅', pepper: '🌶️', cucumber: '🥒',
        strawberry: '🍓', grape: '🍇', peach: '🍑', pear: '🍐',
        herbs: '🌿', basil: '🌿', mint: '🌿', parsley: '🌿'
    };
    
    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
        if (lowerName.includes(key)) return emoji;
    }
    
    return '🥕'; // default emoji
}

function removeProduceItem(button, productId) {
    if (productId) {
        // Remove from storage
        farmerProducts = farmerProducts.filter(product => product.id !== productId);
        localStorage.setItem('farmerProducts', JSON.stringify(farmerProducts));
    }
    button.parentElement.remove();
}

function donateSurplusFood() {
    const food = document.getElementById('surplus-food').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const location = document.getElementById('pickup-location').value;
    
    if (!food || !expiryDate || !location) {
        showStatusMessage('donation-status', 'Please fill in all fields for food donation.', 'error');
        return;
    }

    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        showStatusMessage('donation-status', `Food donation registered! ${food} will be picked up from ${location}. NGOs have been notified.`, 'success');
        
        // Clear form
        document.getElementById('surplus-food').value = '';
        document.getElementById('expiry-date').value = '';
        document.getElementById('pickup-location').value = '';
        
        stopLoading();
    }, 1500);
}

function requestFertilizer() {
    const type = document.getElementById('fertilizer-type').value;
    const quantity = document.getElementById('fertilizer-quantity').value;
    const address = document.getElementById('delivery-address').value;
    
    if (!type || !quantity || !address) {
        showStatusMessage('fertilizer-status', 'Please fill in all fields for fertilizer request.', 'error');
        return;
    }

    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        
        showStatusMessage('fertilizer-status', 
            `Fertilizer request submitted! ${quantity} tons of ${type} will be delivered to ${address} by ${deliveryDate.toLocaleDateString()}.`, 
            'success'
        );
        
        // Clear form
        document.getElementById('fertilizer-type').value = '';
        document.getElementById('fertilizer-quantity').value = '';
        document.getElementById('delivery-address').value = '';
        
        stopLoading();
    }, 1200);
}

// Global storage for farmer products
let farmerProducts = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// NGO Portal Functions
function claimDonation(donationType) {
    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        const donationItem = button.closest('.donation-item');
        const donationInfo = donationItem.querySelector('h4').textContent;
        
        // Remove the claimed item with animation
        donationItem.style.opacity = '0';
        donationItem.style.transform = 'translateX(-100px)';
        
        setTimeout(() => {
            donationItem.remove();
        }, 300);
        
        showStatusMessage('claim-status', 
            `Successfully claimed: ${donationInfo}. Pickup details have been sent to your email.`, 
            'success'
        );
        
        stopLoading();
    }, 1000);
}

function scheduleWasteCollection() {
    const wasteType = document.getElementById('waste-type').value;
    const quantity = document.getElementById('waste-quantity').value;
    const location = document.getElementById('collection-location').value;
    const date = document.getElementById('collection-date').value;
    
    if (!wasteType || !quantity || !location || !date) {
        showStatusMessage('collection-status', 'Please fill in all fields to schedule waste collection.', 'error');
        return;
    }

    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        showStatusMessage('collection-status', 
            `Waste collection scheduled! ${quantity}kg of ${wasteType} will be collected from ${location} on ${new Date(date).toLocaleDateString()}.`, 
            'success'
        );
        
        // Clear form
        document.getElementById('waste-type').value = '';
        document.getElementById('waste-quantity').value = '';
        document.getElementById('collection-location').value = '';
        document.getElementById('collection-date').value = '';
        
        stopLoading();
    }, 1200);
}

function createVolunteerTask() {
    const taskType = document.getElementById('task-type').value;
    const taskDate = document.getElementById('task-date').value;
    const volunteersNeeded = document.getElementById('volunteers-needed').value;
    
    if (!taskType || !taskDate || !volunteersNeeded) {
        showStatusMessage('task-status', 'Please fill in all fields to create a volunteer task.', 'error');
        return;
    }

    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        showStatusMessage('task-status', 
            `Volunteer task created! "${taskType}" scheduled for ${new Date(taskDate).toLocaleDateString()} requiring ${volunteersNeeded} volunteers. Volunteers will be notified.`, 
            'success'
        );
        
        // Clear form
        document.getElementById('task-type').value = '';
        document.getElementById('task-date').value = '';
        document.getElementById('volunteers-needed').value = '';
        
        stopLoading();
    }, 1000);
}

// Market functionality
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = parseFloat(document.getElementById('price-filter').value);
    const searchFilter = document.getElementById('search-filter').value.toLowerCase();
    const priceDisplay = document.getElementById('price-display');
    
    if (priceDisplay) {
        priceDisplay.textContent = `₹${priceFilter}/kg`;
    }
    
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const price = parseFloat(card.getAttribute('data-price'));
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const farmerName = card.querySelector('.farmer-name').textContent.toLowerCase();
        
        let visible = true;
        
        // Category filter
        if (categoryFilter && category !== categoryFilter) {
            visible = false;
        }
        
        // Price filter
        if (price > priceFilter) {
            visible = false;
        }
        
        // Search filter
        if (searchFilter && !productName.includes(searchFilter) && !farmerName.includes(searchFilter)) {
            visible = false;
        }
        
        card.style.display = visible ? 'block' : 'none';
        if (visible) visibleCount++;
    });
    
    // Show/hide no products message
    const noProductsDiv = document.getElementById('no-products');
    if (noProductsDiv) {
        noProductsDiv.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function addToCart(productType, cardId) {
    const card = document.querySelector(`[data-testid="product-card-${cardId}"]`);
    const qtyInput = document.getElementById(`qty-${cardId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const productName = card.querySelector('h3').textContent;
    const farmerName = card.querySelector('.farmer-name').textContent;
    const priceText = card.querySelector('.price').textContent;
    const price = parseFloat(priceText.replace('₹', '').replace('/kg', ''));
    
    const cartItem = {
        id: Date.now(),
        name: productName,
        farmer: farmerName,
        price: price,
        quantity: quantity,
        total: price * quantity
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // Show success message
    showCartMessage(`Added ${quantity}kg of ${productName} to cart!`);
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.total;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.farmer} • ${item.quantity}kg × ₹${item.price.toFixed(0)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="cart-item-price">₹${item.total.toFixed(0)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(cartItemDiv);
    });
    
    if (cartTotal) cartTotal.textContent = total.toFixed(0);
    if (cartCount) cartCount.textContent = cart.length;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    alert(`Thank you for your order! Total: ₹${total.toFixed(0)}\n\nYour fresh produce will be prepared for pickup or delivery. You will receive a confirmation email shortly.`);
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    toggleCart();
}

function showCartMessage(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-medium);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Load farmer products into market on page load
function loadFarmerProductsInMarket() {
    const farmerProductsContainer = document.getElementById('farmer-products');
    if (!farmerProductsContainer) return;
    
    farmerProductsContainer.innerHTML = '';
    
    farmerProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-testid', `farmer-product-${product.id}`);
        productCard.setAttribute('data-category', product.category);
        productCard.setAttribute('data-price', product.price);
        
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="farmer-name">${product.farmerName}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span class="available-qty">Available: ${product.quantity}kg</span>
                    <span class="location">📍 ${product.location}</span>
                </div>
                <div class="product-pricing">
                    <span class="price">₹${product.price.toFixed(0)}/kg</span>
                    <div class="quantity-controls">
                        <label for="qty-farmer-${product.id}">Quantity (kg):</label>
                        <input type="number" id="qty-farmer-${product.id}" min="1" max="${product.quantity}" value="1" data-testid="input-qty-farmer-${product.id}">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="addToCartFarmer(${product.id})" data-testid="button-buy-farmer-${product.id}">Add to Cart</button>
            </div>
        `;
        
        farmerProductsContainer.appendChild(productCard);
    });
}

function addToCartFarmer(productId) {
    const product = farmerProducts.find(p => p.id === productId);
    if (!product) return;
    
    const qtyInput = document.getElementById(`qty-farmer-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (!quantity || quantity <= 0 || quantity > product.quantity) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const cartItem = {
        id: Date.now(),
        name: product.name,
        farmer: product.farmerName,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    showCartMessage(`Added ${quantity}kg of ${product.name} to cart!`);
}

function addDistributionCenter() {
    const button = event.target;
    const stopLoading = showLoading(button);

    setTimeout(() => {
        showStatusMessage('task-status', 
            'New distribution center form opened. Please fill in the location details and operating hours.', 
            'info'
        );
        
        stopLoading();
    }, 500);
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        if (isNaN(value) || parseFloat(value) < 0) {
            showFieldError(field, 'Please enter a valid positive number');
            return false;
        }
    }
    
    // Date validation
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(field, 'Please select a future date');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Escape key to close modals or cancel operations
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Close mobile menu
        const navMenu = document.querySelector('.nav-menu.active');
        if (navMenu) {
            navMenu.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    }
});

// Add error styles to CSS
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--error);
        box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
    }
    
    .field-error {
        animation: slideInUp 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Initialize tooltips and other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth hover effects to cards
    const cards = document.querySelectorAll('.dashboard-card, .feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize market functionality if on market page
    if (window.location.pathname.includes('market.html')) {
        loadFarmerProductsInMarket();
        updateCartUI();
    }
    
    // Add CSS for cart animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }, 0);
    });
}