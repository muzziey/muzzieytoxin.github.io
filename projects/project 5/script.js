let cart = [];

// Carousel
document.querySelectorAll('.carousel').forEach(c => {
  const imgs = c.querySelectorAll('img');
  let idx = 0;
  setInterval(() => {
    imgs.forEach((img, i) => img.style.opacity = i === idx ? '1' : '0');
    idx = (idx + 1) % imgs.length;
  }, 2000);
});

// Quantity + options
document.querySelectorAll('.food-card').forEach(card => {
  const plus = card.querySelector('.plus');
  const minus = card.querySelector('.minus');
  const qtyEl = card.querySelector('.qty');
  const name = card.querySelector('h3').textContent;
  const basePrice = parseInt(card.querySelector('.price').dataset.price);
  const options = card.querySelectorAll('.options input');

  function updateCartItem(qty){
    let extraTotal = 0;
    let selectedExtras = [];
    options.forEach(opt => {
      if(opt.checked){
        extraTotal += parseInt(opt.dataset.price);
        selectedExtras.push(opt.dataset.extra);
      }
    });
    const existing = cart.find(item => item.name === name);
    const totalPrice = (basePrice + extraTotal) * qty;

    if(existing){
      if(qty === 0) cart = cart.filter(i => i.name !== name);
      else existing.qty = qty, existing.extras = selectedExtras, existing.price = totalPrice;
    } else if(qty > 0){
      cart.push({name, qty, extras: selectedExtras, price: totalPrice});
    }
    renderCart();
  }

  plus.addEventListener('click', ()=>{
    let qty = parseInt(qtyEl.textContent)+1;
    qtyEl.textContent = qty;
    updateCartItem(qty);
  });
  minus.addEventListener('click', ()=>{
    let qty = parseInt(qtyEl.textContent)-1;
    if(qty<0) qty=0;
    qtyEl.textContent = qty;
    updateCartItem(qty);
  });

  options.forEach(opt=>{
    opt.addEventListener('change', ()=>updateCartItem(parseInt(qtyEl.textContent)));
  });
});

const cartSidebar = document.getElementById('cart');
const cartBtn = document.getElementById('cart-btn');
const cartClose = document.getElementById('cart-close');
const cartCount = document.getElementById('cart-count');

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
}

// Open Cart
cartBtn.addEventListener('click', () => {
  cartSidebar.classList.add('open');
});

// Close Cart
cartClose.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
});

// Update cart count whenever cart changes
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const totalEl = document.getElementById('total');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    let extrasText = item.extras.length > 0 ? ` (${item.extras.join(", ")})` : '';
    const li = document.createElement('li');
    li.textContent = `${item.name}${extrasText} x ${item.qty} = $${item.price}`;
    cartItems.appendChild(li);
    total += item.price;
  });
  totalEl.textContent = total;
  updateCartCount();
}

// WhatsApp checkout
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(cart.length===0){ alert("Cart is empty!"); return; }
  let message = "Hello! I want to order:\n";
  cart.forEach(item=>{
    let extrasText = item.extras.length>0 ? ` (${item.extras.join(", ")})` : '';
    message += `${item.name}${extrasText} x ${item.qty} = $${item.price}\n`;
  });
  message += `Total: $${cart.reduce((a,b)=>a+b.price,0)}`;
  const phone = "1234567890";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,'_blank');
});

// Search
document.getElementById('search').addEventListener('input', e=>{
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.food-card').forEach(card=>{
    card.style.display = card.querySelector('h3').textContent.toLowerCase().includes(term) ? 'block' : 'none';
  });
});

// Category filtering
document.querySelectorAll('.category-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.category-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.food-card').forEach(card=>{
      card.style.display = (cat==='all' || card.dataset.category===cat) ? 'block' : 'none';
    });
  });
});
// Scroll to category section on button click
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const section = document.getElementById(targetId);
    if(section){
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

