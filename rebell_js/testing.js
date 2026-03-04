// Dev-side Product Manager (using localStorage instead of Firebase)
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-analytics.js";
import {getDatabase, onValue, ref, push, set, remove, get} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBUtgDsI6KtuQuHhVGg-NnAW0LpahsDAfk",
    authDomain: "rebell-ub.firebaseapp.com",
    databaseURL: "https://rebell-ub-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "rebell-ub",
    storageBucket: "rebell-ub.firebasestorage.app",
    messagingSenderId: "137665480014",
    appId: "1:137665480014:web:c163f97f817af427af4a1f",
    measurementId: "G-WYZEPSZZK6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('⚠️ Analytics initialization failed (this is normal for local files):', error.message);
}
const db = getDatabase(app);
const productRef = ref(db, 'products');

// Firebase connection check
console.log('🔥 Firebase initialized successfully');
console.log('📊 Analytics enabled:', analytics ? 'Yes' : 'No (normal for local files)');
console.log('🗄️ Database reference created:', productRef ? 'Yes' : 'No');
console.log('🔗 Database URL:', db.app?.options?.databaseURL || 'Not available');

if (!db.app?.options?.databaseURL) {
  console.error('❌ Database URL not set! This indicates Firebase Realtime Database may not be enabled.');
  console.error('📋 To fix this:');
  console.error('   1. Go to https://console.firebase.google.com/');
  console.error('   2. Select your project "rebell-ub"');
  console.error('   3. Go to Realtime Database > Create database');
  console.error('   4. Choose "Start in test mode" for development');
  console.error('   5. Copy the database URL from Firebase Console');
  console.error('   6. Make sure it matches: https://rebell-ub-default-rtdb.europe-west1.firebasedatabase.app');
}

// Test database connection
console.log('🔍 Attempting Firebase database connection...');
get(productRef).then((snapshot) => {
  console.log('✅ Firebase connection test successful');
  console.log('📦 Current data in products:', snapshot.val());
}).catch((error) => {
  console.error('❌ Firebase connection test failed:', error.message);
  console.error('🔍 Error code:', error.code);
  console.error('📋 Error details:', error);

  // Provide specific troubleshooting based on error
  if (error.code === 'PERMISSION_DENIED') {
    console.error('🚫 PERMISSION_DENIED: Check your Firebase Database security rules');
    console.error('   Go to Firebase Console > Realtime Database > Rules');
    console.error('   Make sure rules allow read/write access');
  } else if (error.code === 'UNAVAILABLE') {
    console.error('🚫 UNAVAILABLE: Firebase service is temporarily unavailable');
    console.error('   Check your internet connection');
  } else if (error.message.includes('project')) {
    console.error('🚫 PROJECT_ERROR: Firebase project may not exist or Realtime Database not enabled');
    console.error('   Go to Firebase Console > Realtime Database > Create database');
  } else {
    console.error('💡 Possible causes:');
    console.error('   - No internet connection');
    console.error('   - Firebase project not configured correctly');
    console.error('   - Database security rules blocking access');
    console.error('   - Opening file locally (CORS restrictions)');
  }
});


class ProductManager {
  constructor() {
    this.products = this.loadProducts();
    this.productGrid = document.querySelector('.product-grid');
    this.init();
  }

  // Load products from Firebase (shared across all users)
  loadProducts() {
    console.log('🔄 Loading products from Firebase...');
    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📥 Raw Firebase data received:', data);
      if (data) {
        this.products = Object.keys(data).map(key => ({
          firebaseId: key,
          ...data[key]
        }));
        console.log('📋 Products processed:', this.products.length, 'items');
      } else {
        console.log('📝 No products found, adding defaults...');
        // Add default dev products if none exist
        this.addDefaultProducts();
        return;
      }
      this.renderProducts();
      console.log('✅ Products loaded and rendered successfully');
    }, (error) => {
      console.error('❌ Error loading products from Firebase:', error);
    });
  }

  // Add default dev products to Firebase
  addDefaultProducts() {
    const defaultProducts = [
      {
        name: 'Dev Product 1',
        description: 'Test product for development',
        image: 'https://via.placeholder.com/200',
        link: '#',
        class: 'dev-product',
        id: 'dev-1'
      }
    ];
    
    defaultProducts.forEach(product => {
      push(productRef, product);
    });
    console.log('Default dev products added to Firebase');
  } 

  init() {
    this.loadProducts();
    this.createAdminPanel();
    console.log('Shared ProductManager initialized');
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
    const cardContainer = document.createElement('div');
    cardContainer.className = 'product-card';
    cardContainer.dataset.productId = product.firebaseId
    
    const card = document.createElement('div');
    card.className = `product-card ${product.class || ''}`;
    card.id = product.id || '';
    card.dataset.productId = product.firebaseId;

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="admin-buttons">
        <button onclick="productManager.editProduct('${product.firebaseId}')">Rediger</button>
        <button onclick="productManager.deleteProduct('${product.firebaseId}')">Slett</button>
      </div>
    `;

    link.appendChild(card);
    return link;
  }

  addProducts(product) {
    console.log('📤 Adding product to Firebase:', product);
    push(productRef, product).then(() => {
      console.log('✅ Product successfully added to shared Firebase:', product.name);
    }).catch((error) => {
      console.error('❌ Failed to add product to Firebase:', error);
    });
  }

  updateProduct(updatedProduct) {
    const id = updatedProduct.firebaseId;
    const dataToSave = {...updatedProduct };
    delete dataToSave.firebaseId;

    console.log('🔄 Updating product in Firebase:', updatedProduct.name, 'ID:', id);
    set(ref(db, `products/${id}`), dataToSave).then(() => {
      console.log('✅ Product successfully updated in shared Firebase:', updatedProduct.name);
    }).catch((error) => {
      console.error('❌ Failed to update product in Firebase:', error);
    });
  }

  deleteProduct(firebaseId) {
    if(confirm('Vil du slette dette produktet?')) {
      console.log('🗑️ Deleting product from Firebase:', firebaseId);
      remove(ref(db, `products/${firebaseId}`)).then(() => {
        console.log('✅ Product successfully deleted from shared Firebase:', firebaseId);
      }).catch((error) => {
        console.error('❌ Failed to delete product from Firebase:', error);
      });
    }
  }

  showProductForm(product = null) {
    console.log('Opening product form for:', product);
    const name = prompt(product ? `Rediger navn (nåværende: ${product.name}):` : 'Nytt produktnavn:', product ? product.name : '');
    if (!name) return;
    
    const description = prompt(product ? `Rediger beskrivelse (nåværende: ${product.description}):` : 'Produktbeskrivelse:', product ? product.description : '');
    if (description === null) return;
    
    const image = prompt(product ? `Rediger bilde-URL (nåværende: ${product.image}):` : 'Bilde-URL:', product ? product.image : '');
    if (image === null) return;
    
    const link = prompt(product ? `Rediger lenke (nåværende: ${product.link}):` : 'Produkt-lenke:', product ? product.link : '');
    if (link === null) return;
    
    const className = prompt(product ? `Rediger klasse (nåværende: ${product.class}):` : 'CSS-klasse:', product ? product.class : 'product-card');
    if (className === null) return;
    
    const id = prompt(product ? `Rediger ID (nåværende: ${product.id}):` : 'Element-ID:', product ? product.id : '');
    if (id === null) return;
    
    const newProduct = {
      name: name,
      description: description,
      image: image,
      link: link,
      class: className,
      id: id
    };
    
    if (product) {
      this.updateProduct({ ...newProduct, firebaseId: product.firebaseId });
    } else {
      this.addProducts(newProduct);
    }
  }

  createAdminPanel() {
    console.log('Shared admin panel ready - changes sync across all users');
  }

}


window.productManager = new ProductManager();

// Dev testing elements (for quick testing - changes sync to Firebase)
const inputField = document.getElementById('product-input');
const updateBtn = document.getElementById('update-btn');
const display = document.getElementById('display');

// Full form elements
const fullName = document.getElementById('full-name');
const fullDesc = document.getElementById('full-desc');
const fullImage = document.getElementById('full-image');
const fullLink = document.getElementById('full-link');
const fullClass = document.getElementById('full-class');
const fullId = document.getElementById('full-id');
const fullAddBtn = document.getElementById('full-add-btn');

if (updateBtn && inputField) {
  updateBtn.addEventListener('click', () => {
    const newName = inputField.value;
    if (newName.trim()) {
      // Quick add to shared Firebase
      window.productManager.addProducts({
        name: newName,
        description: 'Quick dev test product',
        image: 'https://via.placeholder.com/200',
        link: '#',
        class: 'quick-test',
        id: `quick-${Date.now()}`
      });
      inputField.value = '';
      console.log('Quick test product added to shared Firebase');
    }
  });
}

// Full form handler
if (fullAddBtn && fullName && fullDesc && fullImage && fullLink && fullClass && fullId) {
  fullAddBtn.addEventListener('click', () => {
    const product = {
      name: fullName.value || 'Unnamed Product',
      description: fullDesc.value || 'No description',
      image: fullImage.value || 'https://via.placeholder.com/200',
      link: fullLink.value || '#',
      class: fullClass.value || 'product-card',
      id: fullId.value || `prod-${Date.now()}`
    };
    
    if (product.name.trim()) {
      window.productManager.addProducts(product);
      
      // Clear form
      fullName.value = '';
      fullDesc.value = '';
      fullImage.value = '';
      fullLink.value = '';
      fullClass.value = '';
      fullId.value = '';
      
      console.log('Full product added to shared Firebase');
    }
  });
} else {
  console.warn('Some form elements not found - this is normal if not all inputs exist');
}

