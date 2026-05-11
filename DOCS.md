# KaijuDrop Architecture & Documentation

## 1. Project Overview
**KaijuDrop** is a modern, offline-capable MVP for an Anime Merchandise Store. It is built with high-performance technologies and a premium "Cyberpunk" aesthetic.

### Tech Stack
- **Frontend**: Nuxt 4 (Vue.js), Tailwind CSS
- **State Management**: Pinia with PersistedState
- **Database**: SQLite (local `sqlite.db`)
- **ORM**: Drizzle ORM
- **Driver**: `better-sqlite3` (Strictly synchronous transactions)
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide Vue Next

---

## 2. Architecture

### Directory Structure
- `app/`: Contains the frontend logic (pages, components, assets).
- `server/`: Contains the backend logic (API routes, database connection, schema).
- `drizzle/`: Contains database migrations.
- `scratch/`: Utility scripts for debugging and database maintenance.

### Database Design
The database uses a relational schema defined in `server/database/schema.ts`:
- **Products**: Main merchandise items.
- **ProductVariants**: Specific options (e.g., Size, Version) with individual stock levels.
- **Orders**: Customer purchase records.
- **OrderItems**: Linkage between orders and specific product variants.

### Critical Implementation Detail: Synchronous Transactions
Because the project uses the `better-sqlite3` driver, all database transactions **must be synchronous**. 
- **Rule**: No `async/await` inside `db.transaction(...)`.
- **Implementation**: Use `.get()`, `.all()`, and `.run()` instead of `.execute()` or relational queries that return promises.

---

## 3. Key Components

### `Hero.vue`
The hero section uses **GSAP** for entrance animations and a custom mouse-parallax effect. It creates a premium first impression.

### `ProductCard.vue`
A highly-styled card using glassmorphism and hover effects to showcase product data.

### `Checkout.vue`
A multi-step checkout form that communicates with the `/api/checkout` endpoint. It handles real-time stock validation and error feedback.

---

## 4. API Endpoints

### `GET /api/merch`
Fetches products with optional filters for `category` and `franchise`.

### `POST /api/checkout`
Handles order processing. 
- **Logic**: Validates stock -> Decrements stock -> Creates Order -> Returns success.
- **Errors**: Returns `SOLDOUT:Title` if an item is out of stock during the transaction.

---

## 5. State Management & Persistence

The application uses **Pinia** for client-side state management, specifically for the shopping cart.
- **Store**: `app/stores/cart.ts`
- **Persistence**: Integrated with `pinia-plugin-persistedstate` to ensure cart data survives page reloads by syncing with `LocalStorage`.
- **Logic**: Handles quantity increments/decrements, item removal, and subtotal calculations.

---

## 6. Admin Dashboard (Command Center)

Located at `/admin`, this dashboard is the "nerve center" of the application.
- **Orders Overview**: Live feed of all database transactions.
- **Fulfillment Protocol**: Allows administrators to update order statuses (Pending -> Shipped) or cancel them.
- **Real-time Signal**: Uses Nuxt's `useFetch` refresh mechanism to update the UI without full page loads.

---

## 7. Development & Troubleshooting

### Running the App
```bash
# Recommended for Windows
bun run dev
```

### Known Issues: Bun Protocol Error
If you encounter `Error: Received protocol 'bun:'`, it usually means a Node.js process is trying to load a Bun-specific resource. 
**Solution**: Ensure you are using the latest version of Bun (1.1.x+) and that `nuxt.config.ts` does not have an explicit Nitro preset that forces Bun if you are running in a mixed environment.
