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
      <label>
        qty: 
        <input type="number" min="1" value="${item.Quantity || 1}" class="quantity-input" data-id="${item.Id}" />
      </label>
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

  setCartContents(contents) {
    setLocalStorage(this.key, contents);
  }

  addItem(itemToAdd) {
    const cartItems = this.getCartContents();
    const existingItem = cartItems.find(item => item.Id === itemToAdd.Id);

    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 1) + 1;
    } else {
      itemToAdd.Quantity = 1;
      cartItems.push(itemToAdd);
    }

    this.setCartContents(cartItems);
  }

  removeFromCart(id) {
    let cartItems = this.getCartContents();
    cartItems = cartItems.filter(item => item.Id !== id);
    this.setCartContents(cartItems);
    this.displayCartContents(); 
  }

  updateItemQuantity(id, newQuantity) {
    const cartItems = this.getCartContents();
    const item = cartItems.find(product => product.Id === id);
    if (item) {
      item.Quantity = newQuantity;
      this.setCartContents(cartItems);
      this.displayCartContents(); 
    }
  }

  displayCartContents() {
    const cartItems = this.getCartContents();
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, 'afterbegin', true);

    this.listElement.querySelectorAll('.remove-button').forEach(button => {
      button.addEventListener('click', (e) => {
        this.removeFromCart(e.target.dataset.id);
      });
    });

    this.listElement.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const newQty = parseInt(e.target.value);
        const id = e.target.dataset.id;
        if (newQty > 0) {
          this.updateItemQuantity(id, newQty);
        } else {
          this.removeFromCart(id); 
        }
      });
    });
  }
}

