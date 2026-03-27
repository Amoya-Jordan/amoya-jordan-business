/*  Auriva Essential Oils — External JavaScript */

/*  JS Q2d: Load cart from localStorage so it persists across pages  */
var cart = JSON.parse(localStorage.getItem("auriva_cart")) || [];

/*  JS Q2d: Save cart to localStorage after every change  */
function saveCart() {
  localStorage.setItem("auriva_cart", JSON.stringify(cart));
}

/* ============================================================
   JS Q2a: DOM Manipulation — addToCart()
   JS Q2d: Logic — handles existing items vs new items
   ============================================================ */
function addToCart(productName, price, image, isBundle) {
  if (isBundle === undefined) { isBundle = false; }

  /* JS Q2d: Control structure — check if item already in cart */
  var existing = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === productName) { existing = cart[i]; break; }
  }

  if (existing) {
    existing.qty++;                  /* JS Q2d: Arithmetic — increment quantity */
  } else {
    cart.push({ name: productName, price: price, qty: 1, image: image, isBundle: isBundle });
  }

  saveCart();
  updateCart();
  showToast(productName + " added to cart!");
}

/* ============================================================
   JS Q2a: DOM Manipulation — updateCart()
   Dynamically rebuilds the cart display and recalculates totals
   ============================================================ */
function updateCart() {
  /* JS Q2a: getElementById — DOM access */
  var cartDiv = document.getElementById("cart-items");
  if (!cartDiv) return;

  /* JS Q2d: Control structure — empty cart state */
  if (cart.length === 0) {
    cartDiv.innerHTML =
      '<div class="empty-cart">' +
        '<p>Your cart is empty.</p>' +
        '<a href="product.html" class="btn">Continue Shopping</a>' +
      '</div>';
    resetSummary();
    return;
  }

  cartDiv.innerHTML = "";
  var subtotal = 0;

  /* JS Q2d: Loop through cart items */
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    /* JS Q2d: Arithmetic — apply 10% bundle discount */
    var itemPrice = item.isBundle ? item.price * 0.90 : item.price;
    var itemTotal = itemPrice * item.qty;
    subtotal += itemTotal;

    /* JS Q2a: DOM manipulation — create and inject cart item */
    var div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML =
      '<img src="../Assets/images/' + item.image + '" alt="' + item.name + '" width="80" height="80">' +
      '<div>' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + (item.isBundle ? "Bundle (10% off)" : "Single Oil") + '</p>' +
        '<p>JMD $' + itemPrice.toFixed(0) + ' each</p>' +
      '</div>' +
      '<div class="qty-controls">' +
        '<button onclick="decreaseQty(' + i + ')" aria-label="Decrease">&#8722;</button>' +
        '<span>' + item.qty + '</span>' +
        '<button onclick="increaseQty(' + i + ')" aria-label="Increase">&#43;</button>' +
      '</div>' +
      '<div style="min-width:100px;text-align:right;">' +
        '<p style="font-weight:600;color:var(--dark-green);">JMD $' + itemTotal.toFixed(0) + '</p>' +
        '<button class="btn btn-outline" style="font-size:0.65rem;padding:0.4rem 0.8rem;margin-top:0.4rem;animation:none;" onclick="removeItem(' + i + ')">Remove</button>' +
      '</div>';
    cartDiv.appendChild(div);
  }

  /* JS Q2d: Arithmetic — tax and grand total */
  var tax   = subtotal * 0.15;
  var total = subtotal + tax;

  /* JS Q2a: DOM manipulation — update summary */
  var sub   = document.getElementById("cart-subtotal");
  var taxEl = document.getElementById("cart-tax");
  var totEl = document.getElementById("cart-total");
  if (sub)   sub.innerText   = "Subtotal: JMD $" + subtotal.toFixed(0);
  if (taxEl) taxEl.innerText = "Tax (15%): JMD $" + tax.toFixed(0);
  if (totEl) totEl.innerText = "Grand Total: JMD $" + total.toFixed(0);
}

function resetSummary() {
  var sub   = document.getElementById("cart-subtotal");
  var taxEl = document.getElementById("cart-tax");
  var totEl = document.getElementById("cart-total");
  if (sub)   sub.innerText   = "Subtotal: JMD $0";
  if (taxEl) taxEl.innerText = "Tax (15%): JMD $0";
  if (totEl) totEl.innerText = "Grand Total: JMD $0";
}

/* ============================================================
   JS Q2d: Quantity controls
   ============================================================ */
function increaseQty(index) {
  cart[index].qty++;
  saveCart();
  updateCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

/* ============================================================
   JS Q2a: Toast notification — DOM feedback
   ============================================================ */
function showToast(message) {
  var toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed;bottom:2rem;right:2rem;z-index:9999;" +
    "background:var(--dark-green);color:var(--cream);" +
    "padding:0.9rem 1.6rem;border-radius:2px;" +
    "font-family:var(--font-sans);font-size:0.8rem;letter-spacing:0.1em;" +
    "box-shadow:0 4px 20px rgba(0,0,0,0.2);" +
    "border-left:3px solid var(--gold);";
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s";
    setTimeout(function() { toast.remove(); }, 400);
  }, 2500);
}

/* ============================================================
   JS Q2b: Event Handling — DOMContentLoaded
   JS Q2c: Form Validation
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {   /* JS Q2b: Event listener #1 */

  /* Initialise cart display on cart page */
  if (document.getElementById("cart-items")) {
    updateCart();
  }

  /* ── LOGIN FORM ── */
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {        /* JS Q2b: Event listener #2 */
      e.preventDefault();
      clearErrors();
      var username = document.getElementById("login-username").value.trim();
      var password = document.getElementById("login-password").value.trim();
      var valid = true;
      if (username === "") { showError("login-username", "Username is required."); valid = false; }
      if (password === "") { showError("login-password", "Password is required."); valid = false; }
      else if (password.length < 6) { showError("login-password", "Password must be at least 6 characters."); valid = false; }
      if (valid) { showToast("Login successful! Welcome back."); loginForm.reset(); }
    });
  }

  /* ── REGISTER FORM ── */
  var registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function(e) {     /* JS Q2b: Event listener #3 */
      e.preventDefault();
      clearErrors();
      var name     = document.getElementById("reg-name").value.trim();
      var dob      = document.getElementById("reg-dob").value;
      var email    = document.getElementById("reg-email").value.trim();
      var username = document.getElementById("reg-username").value.trim();
      var password = document.getElementById("reg-password").value.trim();
      var valid    = true;
      if (name === "")     { showError("reg-name",     "Full name is required.");            valid = false; }
      if (dob  === "")     { showError("reg-dob",      "Date of birth is required.");        valid = false; }
      if (email === "")    { showError("reg-email",    "Email is required.");                valid = false; }
      else if (!isValidEmail(email)) { showError("reg-email", "Enter a valid email."); valid = false; }
      if (username === "") { showError("reg-username", "Username is required.");             valid = false; }
      if (password === "") { showError("reg-password", "Password is required.");             valid = false; }
      else if (password.length < 6) { showError("reg-password", "Min. 6 characters.");      valid = false; }
      if (valid) { showToast("Registration successful! Welcome to Auriva."); registerForm.reset(); }
    });
  }

  /* ── CHECKOUT FORM ── */
  var checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function(e) {     /* JS Q2b: Event listener #4 */
      e.preventDefault();
      clearErrors();
      var name    = document.getElementById("co-name").value.trim();
      var address = document.getElementById("co-address").value.trim();
      var phone   = document.getElementById("co-phone").value.trim();
      var amount  = document.getElementById("co-amount").value.trim();
      var valid   = true;
      if (name === "")    { showError("co-name",    "Name is required.");    valid = false; }
      if (address === "") { showError("co-address", "Address is required."); valid = false; }
      if (phone === "")   { showError("co-phone",   "Phone is required.");   valid = false; }
      if (amount === "" || isNaN(amount) || Number(amount) <= 0) {
        showError("co-amount", "Enter a valid payment amount."); valid = false;
      }
      if (valid) {
        showToast("Order confirmed! Thank you for shopping with Auriva.");
        clearCart();
        checkoutForm.reset();
      }
    });
  }

});

/* ============================================================
   JS Q2c: Validation helpers
   ============================================================ */
function showError(fieldId, message) {
  var field = document.getElementById(fieldId);
  if (!field) return;
  var err = document.createElement("span");
  err.className   = "error-msg";
  err.textContent = message;
  field.parentNode.appendChild(err);
  field.style.borderColor = "#c0392b";
}

function clearErrors() {
  /* JS Q2a: querySelectorAll — DOM access */
  var errors = document.querySelectorAll(".error-msg");
  for (var i = 0; i < errors.length; i++) { errors[i].remove(); }
  var inputs = document.querySelectorAll("input");
  for (var i = 0; i < inputs.length; i++) { inputs[i].style.borderColor = ""; }
}

/* JS Q2c: Email format validation using regex */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
