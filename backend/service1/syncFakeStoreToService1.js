// syncFakeStoreToService1.js
// uruchamianie: node syncFakeStoreToService1.js

const SERVICE1_URL = "http://localhost:3001/api/items";
const FAKESTORE_URL = "https://fakestoreapi.com/products";

async function fetchFakeStoreProducts() {
  const res = await fetch(FAKESTORE_URL);
  if (!res.ok) {
    throw new Error("Błąd pobierania produktów z FakeStore");
  }
  return res.json();
}

async function postItemToService1(product) {
  const payload = {
    title: product.title,
    description: product.description,
    price: product.price,
    stock: Math.floor(Math.random() * 50) + 1,
    image: product.image,
    category: product.category,
  };

  const res = await fetch(SERVICE1_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 409) {
    console.log(`  Pominięto (już istnieje): ${product.title}`);
    return;
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Błąd dodawania produktu ${product.title}: ${err}`);
  }

  console.log(` Dodano produkt: ${product.title}`);
}

async function syncProducts() {
  try {
    console.log(" Pobieranie produktów z FakeStore...");
    const products = await fetchFakeStoreProducts();

    for (const product of products) {
      await postItemToService1(product);
    }

    console.log("Synchronizacja zakończona");
  } catch (err) {
    console.error(" Błąd synchronizacji:", err.message);
  }
}

syncProducts();
