import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cartItems = getLocalStorage("so-cart") || [];
  const existingProduct = cartItems.find((item) => item.Id === product.Id);

  if (existingProduct) {
    existingProduct.Quantity += 1;
  } else {
    product.Quantity = 1;
    cartItems.push(product);
  }

  setLocalStorage("so-cart", cartItems);
  alert(`${product.Name} has been added to your cart.`);
  setLocalStorage("so-cart", product);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
