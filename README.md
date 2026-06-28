# 🎨 ArtHub — Online Art Marketplace

> A premium digital platform connecting art lovers, collectors, and global buyers with talented artists. Discover original artworks, buy securely via Stripe, manage dynamic subscription tiers, and explore full role-based creator ecosystem analytics.

<img width="1898" height="841" alt="image" src="https://github.com/user-attachments/assets/deb06f72-3309-4c1d-b836-b57014ef5402" />
<img width="1895" height="838" alt="image" src="https://github.com/user-attachments/assets/42af19ce-8d11-4154-bdad-73a55c804987" />
<img width="1896" height="835" alt="image" src="https://github.com/user-attachments/assets/f5d3cbad-3b9c-420d-897a-b30aa890fa4a" />
---

## 🌐 Live Site & Repositories

🔗 **Live Platform Link:** [https://arthub-three.vercel.app](https://arthub-three.vercel.app)  
🔗 **Client Repository:** [https://github.com/Asmual/arthub-client](https://github.com/Asmual/arthub-client)  
🔗 **Server Repository:** [https://github.com/Asmual/arthub-server](https://github.com/Asmual/arthub-server)  
🔗 **Production Server API:** [https://arthub-server-z4w8.onrender.com/](https://arthub-server-z4w8.onrender.com/)

---

## 🛠️ Tech Stack & Packages

### Core Frameworks
* **⚡ Next.js 15 (App Router):** Full-stack client architecture featuring localized client routing and server telemetry optimization.
* **🚀 Express.js & Node.js:** High-throughput backend REST API execution pipeline.
* **🍃 MongoDB:** Scalable NoSQL persistence engine managing atomic collections for assets, orders, and token registries.

### Key Packages Used
| Scope | Dependency Package | Purpose |
|---|---|---|
| **Client** | `better-auth` / `@better-auth/react` | Enterprise OAuth, Google Login providers, and persistent sessions. |
| **Client** | `lucide-react` & `react-icons` | High-fidelity digital art and interactive workspace iconography. |
| **Client** | `next-themes` | Native tailwind dark mode context synchronization across localStorage. |
| **Client** | `react-hot-toast` | Real-time checkout status, validation warnings, and CRUD triggers. |
| **Client** | `recharts` | Dynamic admin analytics, category pie charts, and monthly gross metrics. |
| **Server** | `jsonwebtoken` (JWT) | Stateless secure cryptographic payload tracking for server endpoints. |
| **Server** | `stripe` | Live webhook capturing, payment intents, and global checkout handling. |
| **Server** | `dotenv` & `cors` | Production environment sandboxing and cross-domain access isolation. |

---

## ✨ Key Features

### 🔐 Multi-Tier Role-Based Authentication
- Native registration and login pipelines driven by **BetterAuth** (Google OAuth & standard credentials).
- Stateful assignment workflows during client signup allowing explicit choice between **User (Buyer)** and **Artist** roles.
- High-grade multi-layer security combining JWT validation locks with server middleware verification checks.

### 🖼️ Public Artwork Ledger & Live Discovery
- Fluid, completely unauthenticated public browse views using modern **Skeleton Loading cards** during asynchronous API handshakes.
- Deep searching, category multi-filtering, and dynamic price sorting (Newest, Price: Low-High, Price: High-Low).
- Dynamic details gateway embedding image integration via ImgBB, comprehensive metadata tracking, and active author locks.

### 💳 Complete Stripe Checkout & Subscription Matrix
- Integrated **Stripe Marketplace Session API** handling dynamic item invoicing and secure order updates.
- Automated core subscription tier tracking on User accounts:
  - **Free Tier ($0):** Limited up to 3 artwork acquisitions.
  - **Pro Tier ($9.99/mo):** Expanded scope accommodating up to 9 acquisitions.
  - **Premium Tier ($19.99/mo):** Fully unlocked unlimited transaction pipelines.
- Smart transaction limits cross-verifying active user tiers on the server prior to generating live checkout states.

### 📊 Advanced Management Dashboards (CRUD Roles)
- **User (Buyer) View:** Direct oversight tracking transaction receipts, absolute order history, and active profile controls.
- **Artist View:** Granular control over self-published listings (Create, Read, Update, Delete) combined with dedicated chronological sales tables.
- **Admin Command Center:** High-level user account management (Role updates), universal catalog pruning, and unified visual data charts (Total revenue trackers, sales graphs, category distribution curves).

### 💬 Premium Challenger Inclusions
- **Closed Commenting Ecosystem:** Conditional write access locking comment textboxes until a verified order matching the active user is resolved in the database.
- **Sold Status & Auto-Unpublish:** Automatic conversion applying `"Sold"` flags immediately after successful processing, safely terminating subsequent checkout actions on the platform.

---

## 📋 Platform Accessibility & Routes Map

| Route Target | Clearance Level | Description |
|---|---|---|
| 🏠 `/` | Public | Marketplace storefront displaying featured drops and top-performing artists. |
| 🔍 `/browse` | Public | Global directory supporting pagination, sorting matrixes, and live keywords. |
| 🎨 `/artwork/[id]` | Public | Deep product analytics, creator profiles, and secure payment triggers. |
| 📊 `/dashboard/user` | Protected (User) | Subscription status grids, active order listings, and account settings. |
| 🧑‍🎨 `/dashboard/artist` | Protected (Artist) | Unified canvas manager (Add/Edit Forms) and automated sales ledgers. |
| 🛡️ `/dashboard/admin` | Protected (Admin) | Global identity role adjustments, revenue charts, and platform-wide monitoring. |

---
## 👨‍💻 Author
- 👤 Name: Asmual Obaidul Hoque  
- 📧 Email: Asmual01@gmail.com
