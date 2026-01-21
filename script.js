document.addEventListener("DOMContentLoaded", () => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartBtn = document.querySelector(".cart");
  const cartPanel = document.getElementById("cartPanel");
  const closeCartBtn = document.getElementById("closeCart");
  const overlay = document.getElementById("overlay");

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const totalPriceEl = document.getElementById("totalPrice");
  const emptyCart = document.getElementById("emptyCart");

  /* SEPET AÇ / KAPAT */
  cartBtn.addEventListener("click", e => {
    e.preventDefault();
    cartPanel.classList.add("active");
    overlay.classList.add("active");
  });

  function closeCart() {
    cartPanel.classList.remove("active");
    overlay.classList.remove("active");
  }

  closeCartBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  /* SEPETE EKLE */
  document.querySelectorAll(".product button").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = btn.closest(".product");
      const name = product.querySelector("h3").innerText.trim();
      const priceText = product.querySelector("span").innerText;
      const price = Number(priceText.replace("₺", "").replace(",", "."));

      const item = cart.find(i => i.name === name);

      if (item) {
        item.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      save();
      render();
    });
  });

  /* SEPETİ ÇİZ */
  function render() {
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      emptyCart.style.display = "block";
    } else {
      emptyCart.style.display = "none";
    }

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const li = document.createElement("li");
      li.className = "cart-item";

      li.innerHTML = `
        <span>${item.name}</span>
        <div class="qty">
          <button class="minus" data-i="${index}">−</button>
          <span>${item.qty}</span>
          <button class="plus" data-i="${index}">+</button>
        </div>
      `;

      cartItems.appendChild(li);
    });

    cartCount.innerText = cart.reduce((a, b) => a + b.qty, 0);
    totalPriceEl.innerText = "₺" + total.toFixed(2);

    bindQtyButtons();
  }

  /* + - BUTONLARI */
  function bindQtyButtons() {
    document.querySelectorAll(".plus").forEach(btn => {
      btn.onclick = () => {
        cart[btn.dataset.i].qty++;
        save();
        render();
      };
    });

    document.querySelectorAll(".minus").forEach(btn => {
      btn.onclick = () => {
        cart[btn.dataset.i].qty--;
        if (cart[btn.dataset.i].qty <= 0) {
          cart.splice(btn.dataset.i, 1);
        }
        save();
        render();
      };
    });
  }

  function save() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  render();
});
const shopierProduct = document.getElementById("shopierProduct");
const shopierPrice = document.getElementById("shopierPrice");

shopierProduct.value = cart.map(i => `${i.name} x${i.qty}`).join(", ");
shopierPrice.value = cart.reduce((t, i) => t + i.price * i.qty, 0).toFixed(2);

/* SCROLL FADE */
const fades = document.querySelectorAll(".fade");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.9 });

fades.forEach(el => observer.observe(el));
