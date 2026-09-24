# TechnoVolt — Frontend

Robototexnika va tech darsliklar platformasining frontend qismi.
React 19 + Vite 8 + Tailwind CSS 4 + TanStack Query, dark tema.

Backend: [`../WebSyteProffessor`](../WebSyteProffessor) (ASP.NET Core 10 + PostgreSQL).

---

## Tez boshlash

```bash
npm install
```

`.env` faylini tekshirib chiqing (`.env.example` dan ko'chirilgan):

```
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=https://localhost:7223
VITE_APP_NAME=TechnoVolt
```

`VITE_API_PROXY_TARGET` — backend qaysi manzilda ishlayotgani.
`dotnet run` ishga tushganda terminalda ko'rsatiladi (qarang:
`WebSyteProffessor/src/WebSyteProffessor/Properties/launchSettings.json`):

| Profil  | Manzil                   |
| ------- | ------------------------ |
| `https` | `https://localhost:7223` |
| `http`  | `http://localhost:5290`  |

Avval **backend**ni, keyin frontendni ishga tushiring:

```bash
npm run dev
```

`http://localhost:5173` ochiladi.

### Nega CORS muammosi yo'q

Brauzer barcha so'rovlarni `/api` ga — ya'ni **o'z origin**iga yuboradi, Vite esa
ularni backendga proxy qiladi. Production'da xuddi shu ishni nginx bajaradi.
Shuning uchun dev va prod bir xil ishlaydi va CORS umuman ishga tushmaydi.
`/uploads` ham shu tarzda proxy qilinadi (kategoriya, video va loyiha rasmlari
backend'ning `wwwroot/uploads` papkasidan beriladi).

---

## Skriptlar

| Buyruq               | Vazifasi                                        |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Dev server (port 5173, `strictPort`)            |
| `npm run build`      | Production build → `dist/`                      |
| `npm run preview`    | Build'ni lokal ko'rib chiqish (port 4173)       |
| `npm run lint`       | ESLint                                          |
| `npm run lint:fix`   | ESLint + avtomatik tuzatish                     |
| `npm run format`     | Prettier                                        |
| `npm run test`       | Vitest (bir marta)                              |
| `npm run test:watch` | Vitest (watch)                                  |
| `npm run check`      | lint + format + test + build — commit'dan oldin |

Dev server porti **5173** da qotirilgan (`strictPort: true`), chunki backend'dagi
`CorsConfigurations.cs` shu portga ruxsat beradi — port o'zgarib ketsa, proxy'siz
ishlatganda CORS xatosi chiqadi.

---

## Loyiha tuzilishi

```
src/
├── api/          Backend bilan gaplashuvchi funksiyalar — har bir controller uchun bitta fayl
├── hooks/        TanStack Query hook'lari (cache, loading, error, invalidation)
├── lib/          apiClient (token refresh), xato matnlari, youtube, formData, format
├── constants/    Backend enum'larining nusxasi (ReactionType, UserRole) va query kalitlari
├── providers/    AuthProvider, QueryProvider
├── components/
│   ├── ui/       Dizayn tizimi: Button, Card, Field, Modal, ImageUpload, Skeleton...
│   ├── layout/   Sidebar, Topbar, MobileNav, AppLayout
│   └── routing/  Route guard'lar, ErrorBoundary, ScrollToTop
├── features/     Domenga xos komponentlar (VideoCard, CategoryCard, CommentSection...)
└── pages/        Har bir route uchun sahifa (+ pages/admin)
```

**Qatlamlar qoidasi:** `pages` → `features`/`components` → `hooks` → `api` → `lib`.
Teskari yo'nalishda import qilinmaydi.

---

## Dizayn tizimi

Ranglar `src/index.css` da Tailwind 4 `@theme` token'lari sifatida e'lon qilingan.
Rangni faqat shu yerda o'zgartirish kerak — qolgan hamma joyda utility ishlatiladi.

| Token       | Qiymat    | Qayerda                        |
| ----------- | --------- | ------------------------------ |
| `primary`   | `#3B82F6` | Tugmalar, havolalar, aktiv nav |
| `accent`    | `#8B5CF6` | Loyiha badge'lari, saqlash     |
| `bg`        | `#0F172A` | Sahifa foni                    |
| `sidebar`   | `#131C2F` | Sidebar, topbar                |
| `surface`   | `#172136` | Kartochkalar                   |
| `raised`    | `#1E293B` | Input'lar, hover               |
| `secondary` | `#334155` | Ikkilamchi tugma hover         |
| `line`      | `#273449` | Chegaralar                     |
| `fg`        | `#E2E8F0` | Asosiy matn                    |
| `muted`     | `#94A3B8` | Ikkilamchi matn                |
| `subtle`    | `#64748B` | Uchlamchi matn                 |
| `success`   | `#10B981` | Progress, ko'rilgan            |
| `warning`   | `#F59E0B` | Exclusive video                |
| `danger`    | `#EF4444` | Xatolar, o'chirish             |

Shrift: **Inter** (Google Fonts, `index.html` da preconnect bilan).

> ⚠️ `bg-cover` ishlatmang — u Tailwind'ning `background-size` utility'si.
> Rasm o'rnidagi gradient uchun `bg-media`, hero uchun `bg-hero`.

---

## Mobil

- Sidebar `md` (768px) dan pastda yashiriladi, o'rniga pastda 4 ta tab'li
  `MobileNav` chiqadi (`pb-safe` — iPhone home indicator uchun).
- Modal'lar telefonda pastdan chiqadigan "sheet", `sm` dan yuqorida markazdagi dialog.
- `AdminUsers` telefonda kartochka, tablet'dan yuqorida jadval ko'rinishida.
- Admin tab'lari va kategoriya filtri gorizontal scroll (`no-scrollbar`).
- 375px dan boshlab gorizontal scroll yo'q.

---

## Rasm yuklash

Kategoriya, video va loyiha rasmlari `multipart/form-data` bilan yuboriladi
(`src/lib/formData.js` yordamchi funksiyalari orqali).

| Nima              | Endpoint               | Maydon                    |
| ----------------- | ---------------------- | ------------------------- |
| Kategoriya ikonka | `POST/PUT /categories` | `IconKey` yoki `IconFile` |
| Kategoriya muqova | `POST/PUT /categories` | `CoverImage`              |
| Video kartochkasi | `POST/PUT /videos`     | `Thumbnail`               |
| Loyiha rasmlari   | `POST /projects`       | `Images` (bir nechta)     |

Cheklovlar (backend'dagi `FileUploadService` bilan bir xil):
**JPG / PNG / WEBP**, har biri **maks. 5MB**. Frontend ham tekshiradi, shuning
uchun xato darhol ko'rinadi.

**Kategoriya ikonkasi** ikki xil bo'lishi mumkin:

1. **Preset** — `src/features/categories/categoryIcons.js` dagi 8 ta tayyor ikonka
   (Arduino, 3D Printing, Robotics, Drones, Projects, Courses, Community, Progress).
   Bazada `preset:arduino` shaklida saqlanadi — hech qanday fayl yuklanmaydi,
   ikonka SVG sifatida chiziladi, shuning uchun har qanday o'lchamda tiniq.
2. **Yuklangan rasm** — `IconFile`, `/uploads/categories/...` ga saqlanadi.

Yangi preset qo'shish: `categoryIconSvgs.jsx` ga komponent yozib,
`categoryIcons.js` dagi `CATEGORY_ICON_PRESETS` ro'yxatiga qo'shing.

Video **kartochka rasmi** ixtiyoriy — yuklamasangiz YouTube'ning rasmi
ishlatiladi. `RemoveThumbnail` yuborilsa, yuklangan rasm o'chib, yana YouTube
rasmiga qaytadi.

---

## Auth

- `accessToken` / `refreshToken` / `user` — `localStorage` da `professor.*` kalitlari bilan.
- Har bir so'rovga `Authorization: Bearer ...` qo'shiladi.
- **401** kelsa `apiClient` bir marta `/auth/refresh` ni chaqirib so'rovni qaytaradi.
  Bir vaqtda kelgan bir nechta 401 **bitta** refresh chaqiruvini kutadi — backend
  eski refresh token'ni bekor qilgani uchun parallel urinishlar sessiyani uzib qo'yardi.
- Refresh ham muvaffaqiyatsiz bo'lsa sessiya tozalanadi va React tree'ga
  `professor:session-expired` event'i yuboriladi (sahifa reload qilinmaydi).
- Boshqa tab'da chiqib ketilsa, `storage` event orqali bu tab ham chiqadi.

### Admin huquqi

Ro'yxatdan o'tgan har bir foydalanuvchi `Role = User` bo'ladi. Admin panelni
ko'rish uchun bazada rolni o'zgartirish kerak:

```sql
UPDATE "AspNetUsers" SET "Role" = 1 WHERE "UserName" = 'sizning_username';
```

Keyin **qaytadan login qiling** — yangi access token `Admin` roli bilan keladi.

---

## Docker

Repo ildizidagi `docker-compose.yml` uch servisni ko'taradi (postgres, backend,
frontend) va `http://localhost` da ochadi:

```bash
docker compose up --build
```

Frontend `nginx:alpine` ustida: statik fayllarni o'zi beradi, `/api` va
`/uploads` ni backendga proxy qiladi (`nginx.conf`).
