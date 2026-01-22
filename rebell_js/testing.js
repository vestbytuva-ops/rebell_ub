// Test firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBUtgDsI6KtuQuHhVGg-NnAW0LpahsDAfk",
    authDomain: "rebell-ub.firebaseapp.com",
    projectId: "rebell-ub",
    storageBucket: "rebell-ub.firebasestorage.app",
    messagingSenderId: "137665480014",
    appId: "1:137665480014:web:c163f97f817af427af4a1f",
    measurementId: "G-WYZEPSZZK6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const productRef = ref(db, 'currentProduct');


class ProductManager {
  constructor() {
    this.products = this.loadProducts();
    this.productGrid = document.querySelector('.product-grid');
    this.init();
  }

  loadProducts() {
    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.products = Object.keys(data).map(key => ({
          firebaseId: key,
          ...data[key]
        }));
    } else {
      this.products = [];
    }
    this.renderProducts();
    });
  } 

  init() {
    this.loadProducts ();
    this.createAdminPanel ();
  }

  renderProducts() {
    if (!this.productGrid) return;
    this.productGrid.innerHTML = '';
    this.products.forEach(product => {
      const productCard = this.createProductCard(product);
      this.productGrid.appendChild(productCard);
    });
  }

  createProductCard(product) {
    const link = document.createElement('a');
    link.href = product.link;
    link.className = 'product-link';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.firebaseId;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.discription}</p>
      <div class="admin-buttons">
        <button onclick="productManager.editProduct(${product.id})"</button>
        <button onclick="productManager.deleteProduct(${product.id})"</button>
      </div>
    `;

    link.appendChild(card);
    return link;
  }

  addProducts(product) {
    push(productRef, product);
    alert('Produkt lagt til i skyen!');
  }

  editProduct(firebaseId) {
    const prduct = this.products.find(p => p.firebaseId === firebaseId);
    if (product) {
      this.showProductForm(product);
    } 
  }

  updateProduct(updateProduct) {
    const id = updatedProduct.firebaseId;
    const dataToSave = {...updateProduct };
    delete dataToSave.firebaseId;

    set(ref(db, `products/${id}`), dataToSave);
    alert('Produkt oppdatert for alle!');
  }

  deleteProduct(firebaseId) {
    if(confirm('Vil du slette dette produktet?')) {
      remove(ref(db, `products/${firebaseId}`));
    }
  }


}


window.ProductManager = new ProductManager();


const inputField = document.getElementById('prduct-input')
const updateBtn = document.getElementById('update-btn')
const display = document.getElementById('display')

updateBtn.addEventListener('click', () => {
  const newName = inputField.value;
  set(productRef, newName);
});

