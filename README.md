# HotelLink Frontend - Multi-Hotel Platform

Frontend application cho hệ thống quản lý khách sạn đa tenant. Một source code, nhiều khách sạn khác nhau.

---

## 🚀 Quick Start - Khách Sạn Mới

### Tự động (Recommended)
```bash
npm install
npm run setup
```

### Manual
```bash
cp .env.example .env
# Edit .env với thông tin khách sạn
npm install
npm run dev
```

📖 **Chi tiết:** [MULTI_HOTEL_SETUP.md](MULTI_HOTEL_SETUP.md)

---

## 📋 Features

- ✅ **Multi-tenant**: Hỗ trợ nhiều khách sạn, chỉ đổi config
- ✅ **Dynamic Content**: Data từ API, không hardcode
- ✅ **VR360 Integration**: Tích hợp tour VR360
- ✅ **SEO Optimized**: Build-time meta injection
- ✅ **Responsive**: Mobile-first design
- ✅ **Multi-language**: Hỗ trợ đa ngôn ngữ
- ✅ **Theme Dynamic**: Màu sắc từ API

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Routing**: React Router v7
- **UI Library**: Ant Design 6
- **Styling**: TailwindCSS 4
- **Build Tool**: Vite 7
- **HTTP Client**: Axios
- **SEO**: React Helmet Async

---

## 🏨 Clone Cho Khách Sạn Mới

### Bước 1: Clone
```bash
git clone <repo-url> phoenix-hotel
cd phoenix-hotel
```

### Bước 2: Setup
```bash
npm install
npm run setup
```

### Bước 3: Development
```bash
npm run dev
```

### Bước 4: Build & Deploy
```bash
npm run build
# Upload dist/ lên server
```

📖 **Chi tiết:** [MULTI_HOTEL_SETUP.md](MULTI_HOTEL_SETUP.md)

---

## 🔧 Configuration

### Environment Variables (`.env`)

```env
# API
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_TENANT_CODE=phoenix              # ← Tenant code
VITE_PROPERTY_ID=13                   # ← Property ID

# Site
VITE_SITE_BASE_URL=https://phoenixhotel.com  # ← Domain

# Auth
VITE_API_USERNAME=phoenix@admin.com
VITE_API_PASSWORD=Phoenix@Admin
```

**Lưu ý:** Mỗi khách sạn có config riêng, chỉ cần đổi file `.env`.

---

## 📜 Available Scripts

```bash
npm run dev          # Development server (port 5173)
npm run build        # Build production + SEO injection
npm run build:only   # Build không inject SEO
npm run preview      # Preview build (port 4173)
npm run setup        # Setup wizard cho hotel mới
npm run inject-seo   # Chỉ chạy SEO injection
npm run lint         # ESLint check
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [MULTI_HOTEL_SETUP.md](MULTI_HOTEL_SETUP.md) | ⭐ **Hướng dẫn setup nhiều khách sạn** |
| [SETUP_NEW_HOTEL.md](SETUP_NEW_HOTEL.md) | Quick setup guide |
| [BUILD_SEO_INJECTION.md](BUILD_SEO_INJECTION.md) | Build-time SEO injection |
| [TEST_SEO_INJECTION.md](TEST_SEO_INJECTION.md) | Test SEO injection |
| [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md) | VR360 integration |
| [API_INTEGRATION_GUIDE.md](API_INTEGRATION_GUIDE.md) | API integration guide |
| [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md) | Development best practices |

---

## 🎯 How It Works

### Multi-Tenant Architecture

```
Backend API
    ↓
[Tenant: phoenix, Property: 13] → Phoenix Hotel
[Tenant: fusion, Property: 10]  → Fusion Suites
[Tenant: grand, Property: 15]   → Grand Hotel
```

**Chỉ cần đổi `.env` - Không cần sửa code!**

---

## 🧪 Testing

### Test API Connection
```bash
curl -X GET "https://travel.link360.vn/api/v1/vr-hotel/settings" \
  -H "X-Tenant-Code: phoenix" \
  -H "X-Property-Id: 13"
```

### Test Local
```bash
npm run dev
# Mở http://localhost:5173
```

### Test Build
```bash
npm run build
npm run preview
```

---

## 📦 Deployment

```bash
# Build
npm run build

# Deploy dist/ folder
# - Manual: scp, rsync
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod --dir=dist
```

---

## 🎉 Example Hotels

| Hotel | Tenant Code | Property ID | Domain |
|-------|------------|-------------|---------|
| Phoenix Hotel VT | `phoenix` | `13` | phoenixhotel.com |
| Fusion Suites VT | `fusion` | `10` | fusionsuites.vn |

---

**Chỉ cần clone và đổi `.env` - Đơn giản vậy thôi!** 🚀

## 🎉 NEW: VR360 System

Dự án đã được setup đầy đủ VR360 system để kết nối với FastAPI backend!

### ✅ Đã có sẵn:
- 📦 **Types & Interfaces** - VR360Link, VR360Category, DTOs
- 🔌 **API Service** - vr360Service với 8 methods CRUD
- 🪝 **React Hooks** - 5 custom hooks để fetch VR360 data
- 🎨 **UI Components** - VR360Viewer, VR360Modal, VR360Gallery
- 📖 **Documentation** - Complete guides & examples
- 🚀 **Ready to use** - Chỉ cần backend implement API!

### 📚 Documentation

| File | Description |
|------|-------------|
| [VR360_SETUP_SUMMARY.md](VR360_SETUP_SUMMARY.md) | ⭐ **BẮT ĐẦU TỪ ĐÂY** - Tổng quan setup |
| [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md) | Full integration guide |
| [VR360_API_EXAMPLES.md](VR360_API_EXAMPLES.md) | Code examples (Fetch & Axios) |
| [.env.example](.env.example) | Environment variables |

### 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env với API URL của bạn

# 3. Run dev server
npm run dev
```

### 💻 Usage Example

```tsx
import { useVR360ByRoom } from './hooks/useVR360';
import { VR360Gallery } from './components/common';

function RoomPage({ roomId }) {
  const { links, loading, error } = useVR360ByRoom(roomId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <VR360Gallery links={links} columns={3} />;
}
```

### 📋 Backend API Requirements

Backend cần implement các endpoints:
- `GET /vr360` - List VR360 links
- `GET /vr360/{id}` - Detail
- `GET /vr360/room/{room_id}` - By room
- `GET /vr360/category/{category}` - By category
- `POST /vr360` - Create (Admin)
- `PATCH /vr360/{id}` - Update (Admin)
- `DELETE /vr360/{id}` - Delete (Admin)

Chi tiết xem [VR360_INTEGRATION_GUIDE.md](VR360_INTEGRATION_GUIDE.md)

---

## Original Template Info

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
