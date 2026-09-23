# RobotTexnika — Frontend

React + Vite + Tailwind CSS bilan yozilgan frontend. Backend'ingiz (`WebSyteProffessor`) bilan ishlashi uchun tayyor.

## O'rnatish

Ushbu papkani kompyuteringizga ko'chiring (masalan `D:\Coding\...\ProfessorSyte\` ichiga, backend bilan bir qatorga), keyin terminalda:

```bash
cd frontend-app
npm install
```

## Backend manzilini sozlash

`.env` faylini oching, backend qaysi portda ishlayotganini yozing (odatda `dotnet run` ishga tushirganda terminalda ko'rsatiladi):

```
VITE_API_BASE_URL=https://localhost:7223/api
```

Agar portingiz boshqacha bo'lsa, shu faylni tahrirlang.

## Ishga tushirish

Avval **backend**ni ishga tushiring (Visual Studio orqali, yoki `dotnet run`). Keyin, shu papkada:

```bash
npm run dev
```

Terminalda ko'rsatilgan manzilni (odatda `http://localhost:5173`) brauzerda oching.

## Muhim eslatma — CORS

Backend'ingizdagi `CorsConfigurations.cs`da frontend porti (`http://localhost:5173`) allaqachon ruxsat berilgan bo'lishi kerak — agar Vite boshqa portda ishga tushsa (masalan band bo'lsa), backend'dagi CORS ruxsat ro'yxatiga shu portni qo'shishingiz kerak bo'ladi.

## Loyiha tuzilishi

```
src/
├── api/          -> backend bilan gaplashuvchi funksiyalar
├── components/   -> qayta ishlatiladigan UI qismlari (Sidebar, Topbar, kartalar)
├── context/      -> AuthContext (login holati)
├── pages/        -> har bir sahifa (Home, VideoDetail, Login, Admin panel va h.k.)
└── utils/        -> yordamchi funksiyalar (YouTube ID ajratish, JWT o'qish)
```

## Admin panel

Faqat Role: "Admin" bo'lgan user'lar sidebar'da "Admin panel" havolasini ko'radi va /admin sahifalariga kira oladi (Categories, Videos, Projects, Users, Dashboard/analytics).

## Sinab ko'rish tartibi

1. /register orqali hisob yarating
2. Backend'da o'zingizni Admin qilib belgilang (avvalgi suhbatimizda ko'rsatilgan SQL orqali)
3. Qaytadan login qiling (yangi token Admin role bilan keladi)
4. Admin panel orqali kategoriya, video, loyiha qo'shing
5. Bosh sahifada natijani ko'ring
