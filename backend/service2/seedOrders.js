
const SERVICE1_ITEMS = "http://localhost:3001/api/items";
const SERVICE2_ORDERS = "http://localhost:3002/api/orders";
const SERVICE2_REVIEW = (orderId) =>
  `http://localhost:3002/api/orders/${orderId}/review`;
const SERVICE3_LOGIN = "http://localhost:3003/api/login";


const ORDERS_PER_ITEM = 20;
const USERS = Array.from({ length: 10 }).map((_, i) => ({
  email: `user${i + 1}@example.com`,
  password: "password123",
}));

const REVIEW_TEXTS = [
  "Bardzo dobry produkt, polecam!",
  "Spełnia oczekiwania, dobra jakość.",
  "Produkt zgodny z opisem.",
  "Jestem zadowolony z zakupu.",
  "Dobry stosunek jakości do ceny.",
  "Solidne wykonanie i szybka dostawa.",
];


async function loginUser(user) {
  const res = await fetch(SERVICE3_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error(`Nie można zalogować ${user.email}`);
  }

  const data = await res.json();
  return {
    token: data.token,
    userId: data.user.id,
  };
}


async function fetchItems() {
  const res = await fetch(SERVICE1_ITEMS);
  if (!res.ok) throw new Error("Nie można pobrać produktów");
  return res.json();
}

async function createOrder(token, userId, itemId) {
  const res = await fetch(SERVICE2_ORDERS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId,
      itemId,
      quantity: Math.floor(Math.random() * 3) + 1,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Błąd tworzenia zamówienia: ${err}`);
  }

  const data = await res.json();
  return data.id;
}

async function addReview(token, orderId) {
  const reviewStars = Math.floor(Math.random() * 3) + 3; // 3–5
  const reviewContent =
    REVIEW_TEXTS[Math.floor(Math.random() * REVIEW_TEXTS.length)];

  const res = await fetch(SERVICE2_REVIEW(orderId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      reviewStars,
      reviewContent,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Błąd dodawania opinii: ${err}`);
  }
}


async function seed() {
  try {
    console.log("Logowanie użytkowników...");
    const loggedUsers = await Promise.all(USERS.map(loginUser));

    console.log(" Pobieranie produktów...");
    const items = await fetchItems();
    const selectedItems = items.slice(0, 20);

    console.log("Tworzenie zamówień i opinii...");
    let counter = 0;

    for (const item of selectedItems) {
      for (let i = 0; i < ORDERS_PER_ITEM; i++) {
        const user =
          loggedUsers[Math.floor(Math.random() * loggedUsers.length)];

        const orderId = await createOrder(
          user.token,
          user.userId,
          item.id
        );

        await addReview(user.token, orderId);

        counter++;
        console.log(
          ` Zamówienie + opinia | produkt ${item.id} | order ${orderId}`
        );
      }
    }

    console.log(
      ` Zakończono! Utworzono ${counter} zamówień z opiniami`
    );
  } catch (err) {
    console.error(" Błąd seedowania:", err.message);
  }
}

seed();
