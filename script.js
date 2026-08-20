const cart=[];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const drawer=$('#cartDrawer');
const overlay=$('#overlay');
const count=$('#cartCount');
const items=$('#cartItems');
const subtotal=$('#subtotal');
const money=n=>`₦${n.toLocaleString('en-NG')}`;

function renderCart(){
  count.textContent=cart.length;
  items.innerHTML=cart.length?cart.map((item,i)=>`<div class="cart-row"><span>${item.name}</span><strong>${money(item.price)}</strong><button data-remove="${i}">Remove</button></div>`).join(''):'<p class="empty">Your bag is waiting.</p>';
  subtotal.textContent=money(cart.reduce((sum,item)=>sum+item.price,0));
  $$('[data-remove]').forEach(button=>button.addEventListener('click',()=>{cart.splice(Number(button.dataset.remove),1);renderCart()}));
}
function showOverlay(){overlay.classList.add('show')}
function hideOverlay(){overlay.classList.remove('show');closePanels();closeCart()}
function openCart(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');showOverlay()}
function closeCart(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
function addToCart(name,price){cart.push({name,price});renderCart();openCart()}
$$('.quick-add,.add-link').forEach(button=>button.addEventListener('click',()=>addToCart(button.dataset.product,Number(button.dataset.price))));
$('#cartOpen').addEventListener('click',openCart);
$('#cartClose').addEventListener('click',hideOverlay);

const searchPanel=$('#searchPanel');
const accountPanel=$('#accountPanel');
function closePanels(){searchPanel.classList.remove('open');accountPanel.classList.remove('open');searchPanel.setAttribute('aria-hidden','true');accountPanel.setAttribute('aria-hidden','true')}
function openSearch(){closeCart();searchPanel.classList.add('open');searchPanel.setAttribute('aria-hidden','false');showOverlay();$('#searchInput').focus()}
function openAccount(){closeCart();accountPanel.classList.add('open');accountPanel.setAttribute('aria-hidden','false');showOverlay()}
$('#searchOpen').addEventListener('click',openSearch);
$('#searchClose').addEventListener('click',hideOverlay);
$('#accountOpen').addEventListener('click',openAccount);
$('#accountClose').addEventListener('click',hideOverlay);
overlay.addEventListener('click',hideOverlay);

const nav=$('#nav');
$('#menuOpen').addEventListener('click',e=>{const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))});
$$('.nav a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');$('#menuOpen').setAttribute('aria-expanded','false')}));

$$('.filter').forEach(button=>button.addEventListener('click',()=>{
  $$('.filter').forEach(item=>item.classList.remove('active'));
  button.classList.add('active');
  const filter=button.dataset.filter;
  let visible=0;
  $$('.product-card').forEach(card=>{
    const matches=filter==='all'||card.dataset.category.split(' ').includes(filter);
    card.hidden=!matches;
    if(matches)visible++;
  });
  $('#resultCount').textContent=`${visible} ${visible===1?'piece':'pieces'}`;
}));

$('#searchInput').addEventListener('input',event=>{
  const term=event.target.value.toLowerCase().trim();
  const matches=$$('.product-card h3').filter(title=>!term||title.textContent.toLowerCase().includes(term)||title.parentElement.textContent.toLowerCase().includes(term));
  $('#searchResults').innerHTML=matches.length?matches.map(title=>`<div class="search-result">${title.textContent}</div>`).join(''):'<p class="empty">No matching pieces yet.</p>';
});

$('#newsletter').addEventListener('submit',event=>{
  event.preventDefault();
  $('#formNote').textContent='You’re on the list. Welcome to D’AYE.';
  event.target.reset();
});

$('.checkout').addEventListener('click',()=>alert(cart.length?'Checkout is ready for payment-gateway integration.':'Your bag is empty.'));
renderCart();