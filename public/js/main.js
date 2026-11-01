const products = {
  "classic-salted": { name: "Classic Salted", price: 119 },
  "peri-peri": { name: "Peri Peri", price: 129 },
  "cream-and-onion": { name: "Cream & Onion", price: 129 },
  "pudina": { name: "Pudina Makhana", price: 129 },
  "combo-pack": { name: "All-4 Flavour Combo Pack", price: 449 }
};

const cart = {};
const phone = "919485807604";

function showToast(message) {
  const toast = document.getElementById("toastMsg");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("active");
  document.getElementById("cartOverlay")?.classList.add("active");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("active");
  document.getElementById("cartOverlay")?.classList.remove("active");
}

function addToCart(id) {
  const product = products[id];
  if (!product) return;

  if (cart[id]) cart[id].quantity++;
  else cart[id] = { ...product, quantity: 1 };

  renderCart();
  openCart();
  showToast(product.name + " added to cart!");
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const badge = document.getElementById("cartBadgeCount");
  const totalElement = document.getElementById("cartTotalPrice");

  const items = Object.entries(cart);
  const count = items.reduce((sum, [, item]) => sum + item.quantity, 0);
  const total = items.reduce((sum, [, item]) => sum + item.price * item.quantity, 0);

  if (badge) badge.textContent = count;
  if (totalElement) totalElement.textContent = "₹" + total;

  if (!container) return;

  if (!items.length) {
    container.innerHTML = "<p>Your cart is empty!</p>";
    return;
  }

  container.innerHTML = items.map(([id, item]) => `
    <div class="cart-item-row">
      <h4>${item.name}</h4>
      <p>₹${item.price} × ${item.quantity}</p>
      <button data-action="decrease" data-id="${id}">−</button>
      ${item.quantity}
      <button data-action="increase" data-id="${id}">+</button>
      <button data-action="remove" data-id="${id}">Remove</button>
    </div>
  `).join("");
}

function orderSingleOnWhatsApp(id) {
  const item = products[id];
  if (!item) return;

  const message = `Hello! I want to order ${item.name} for ₹${item.price}.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}

function checkoutOnWhatsApp() {
  const items = Object.values(cart);

  if (!items.length) {
    showToast("Your cart is empty!");
    return;
  }

  const message = items.map(item =>
    `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
  ).join("\n");

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent("Hello! My order:\n" + message)}`,
    "_blank"
  );
}

window.addToCart = addToCart;
window.orderSingleOnWhatsApp = orderSingleOnWhatsApp;

document.getElementById("cartToggleBtn")?.addEventListener("click", openCart);
document.getElementById("closeCartBtn")?.addEventListener("click", closeCart);
document.getElementById("cartOverlay")?.addEventListener("click", closeCart);
document.getElementById("checkoutWhatsAppBtn")?.addEventListener("click", checkoutOnWhatsApp);

document.getElementById("cartItemsContainer")?.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  if (!cart[id]) return;

  if (action === "increase") cart[id].quantity++;
  if (action === "decrease") cart[id].quantity--;
  if (action === "remove" || cart[id].quantity <= 0) delete cart[id];

  renderCart();
});

document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  document.getElementById("navLinks")?.classList.toggle("active");
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks")?.classList.remove("active");
  });
});

renderCart();