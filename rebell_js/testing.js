let products = []

// Funksjon for å legge til nye elementer
function addItem(name, category, price) {
  const newItem = {
    id: items.length + 1, // enkel id
    name,
    category,
    price
  };
  items.push(newItem);
  console.log(`Lagt til:`, newItem);
}

// Funksjon for filtrering
function filterItems({ name, category, minPrice, maxPrice }) {
  return items.filter(item => {
    let matches = true;

    if (name) {
      matches = matches && item.name.toLowerCase().includes(name.toLowerCase());
    }

    if (category) {
      matches = matches && item.category.toLowerCase() === category.toLowerCase();
    }

    if (minPrice !== undefined) {
      matches = matches && item.price >= minPrice;
    }

    if (maxPrice !== undefined) {
      matches = matches && item.price <= maxPrice;
    }

    return matches;
  });
}

function render(productsToRender) {
      const container = document.getElementById('productList');
      container.innerHTML = ''; // Tømmer listen før rendering

      if (productsToRender.length === 0) {
        container.textContent = "Ingen produkter funnet.";
        return;
      }

      productsToRender.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.textContent = `${product.name} - ${product.category} - ${product.price} kr`;
        container.appendChild(div);
      });
    }


// Eksempel på filtrering
const filtered = filterItems({ category: "Frukt", minPrice: 10 });
console.log(filtered);