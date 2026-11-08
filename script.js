let cart = [];

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
}

function openSizeGuide(e) {
    e.preventDefault();
    document.getElementById('size-modal').classList.add('active');
}

function closeSizeGuide() {
    document.getElementById('size-modal').classList.remove('active');
}

function addCustomToCart(productName, price, cardId) {
    const colorSelect = document.getElementById(`color-${cardId}`);
    const sizeSelect = document.getElementById(`size-${cardId}`);
    
    const selectedColor = colorSelect.value;
    const selectedSize = sizeSelect.value;
    
    // Buat kunci unik berdasarkan nama + warna + ukuran
    const uniqueKey = `${productName} (${selectedColor}, Size ${selectedSize})`;

    const existingItem = cart.find(item => item.uniqueKey === uniqueKey);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            uniqueKey: uniqueKey,
            name: productName,
            color: selectedColor,
            size: selectedSize,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    toggleCart();
}

function updateQuantity(uniqueKey, change) {
    const item = cart.find(i => i.uniqueKey === uniqueKey);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.uniqueKey !== uniqueKey);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Keranjang kamu masih kosong.</p>`;
        cartTotalPrice.textContent = 'Rp 0';
        return;
    }

    let html = '';
    let totalPrice = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        totalPrice += subtotal;
        
        html += `
            <div class="cart-item-row">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Warna: ${item.color} | Size: ${item.size}</p>
                    <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${item.uniqueKey}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.uniqueKey}', 1)">+</button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }

    let message = "Halo Path & Petal, saya ingin memesan produk berikut:\n\n";
    let totalPrice = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        totalPrice += subtotal;
        message += `- ${item.name}\n  (Warna: ${item.color}, Size: ${item.size}) x ${item.quantity} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Belanja: Rp ${totalPrice.toLocaleString('id-ID')}*\n\nMohon informasi ketersediaan stok dan proses pembayarannya ya kak. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6280000000000?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}