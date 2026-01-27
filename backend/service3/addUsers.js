// seedUsersService3.js
// uruchamianie: node seedUsersService3.js

const SERVICE3_URL = "http://localhost:3003/api/register";

const USERS_COUNT = 10;
const DEFAULT_PASSWORD = "password123";

async function createUser(index) {
  const email = `user${index + 1}@example.com`;

  const res = await fetch(SERVICE3_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password: DEFAULT_PASSWORD,
    }),
  });

  if (res.status === 409) {
    console.log(`⏭️  Użytkownik już istnieje: ${email}`);
    return;
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Błąd tworzenia użytkownika ${email}: ${err}`);
  }

  console.log(` Utworzono użytkownika: ${email}`);
}

async function seedUsers() {
  try {
    console.log(" Dodawanie użytkowników do service3...");

    for (let i = 0; i < USERS_COUNT; i++) {
      await createUser(i);
    }

    console.log(" Dodano wszystkich użytkowników");
  } catch (err) {
    console.error(" Błąd seedowania użytkowników:", err.message);
  }
}

seedUsers();
