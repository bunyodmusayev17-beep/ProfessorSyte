# TechnoVolt

Robototexnika va tech video darsliklar platformasi: video darslar, har bir
videoda ishlatilgan jihozlarning do'kon havolalari va loyihalar galereyasi.

## Tuzilishi

```
ProfessorSyte/
├── docker-compose.yml          postgres + backend + frontend
├── frontend/                   React 19 + Vite 8 + Tailwind 4   (README ichida)
└── WebSyteProffessor/          ASP.NET Core 10 + EF Core + PostgreSQL
    ├── WebSyteProffessor.slnx
    └── src/WebSyteProffessor/
```

> Backend'ning assembly/namespace nomi tarixiy sababdan `WebSyteProffessor`
> bo'lib qolgan; mahsulot nomi — **TechnoVolt**.

## Lokal ishga tushirish

### 1. Ma'lumotlar bazasi

PostgreSQL kerak. Ulanish satri
`WebSyteProffessor/src/WebSyteProffessor/appsettings.json` da.

### 2. Backend

```bash
cd WebSyteProffessor/src/WebSyteProffessor
dotnet ef database update
dotnet run
```

Swagger: `https://localhost:7223/swagger`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` — batafsil: [frontend/README.md](frontend/README.md).

## Docker bilan

```bash
docker compose up --build
```

`http://localhost` ochiladi. Yuklangan rasmlar `uploads` volume'ida saqlanadi,
shuning uchun qayta build qilganda yo'qolmaydi.

## Admin huquqi

Ro'yxatdan o'tgan foydalanuvchi `Role = User` bo'ladi. Admin panel uchun:

```sql
UPDATE "AspNetUsers" SET "Role" = 1 WHERE "UserName" = 'sizning_username';
```

So'ng qaytadan login qiling.
