import { getLocalStorage, setLocalStorage, renderListWithTemplate } from './utils.mjs';

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="product_pages/?products=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="product_pages/?products=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ''}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-button" data-id="${item.Id}">❌</button>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  getCartContents() {
    return getLocalStorage(this.key) || [];
  }

  removeFromCart(id) {
    let cartItems = this.getCartContents();
    cartItems = cartItems.filter(item => item.Id !== id);
    setLocalStorage(this.key, cartItems);
    this.displayCartContents(); // re-render
  }

  displayCartContents() {
    const cartItems = this.getCartContents();
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, 'afterbegin', true);

    this.listElement.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', (e) => {
        this.removeFromCart(e.target.dataset.id);
      });
    });
  }
}
