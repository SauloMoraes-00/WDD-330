import ShoppingCart from "./ShoppingCart.mjs";
import { qs, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const listElement = qs('.product-list');
const cart = new ShoppingCart('so-cart', listElement);
cart.displayCartContents();


