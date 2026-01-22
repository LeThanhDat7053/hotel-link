# Build-Time SEO Injection Guide

## Cơ chế hoạt động

### 1. **Build Time (Khi chạy `npm run build`)**
```bash
npm run build
# → vite build 
# → node scripts/inject-seo.js  ← Script này chạy SAU khi build xong
```

**Script `inject-seo.js` sẽ:**
1. Đọc config từ `.env` (API URL, tenant, property ID, site URL)
2. Fetch SEO data từ API backend (`/vr-hotel/settings`)
3. Inject meta tags vào `dist/index.html` (HTML tĩnh đã build)
4. Kết quả: HTML có sẵn meta tags TRƯỚC KHI deploy

### 2. **Runtime (Khi user truy cập)**
- React component `SEOMeta.tsx` vẫn chạy để cập nhật meta tags động
- Canonical URL và og:url được update theo route hiện tại
- Tốt cho SPA (Single Page Application)

---

## Cấu hình

### Bước 1: Cập nhật `.env`
```env
# API Configuration
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_TENANT_CODE=fusion
VITE_PROPERTY_CODE=fusion-suites-vung-tau

# Site Configuration (for build-time SEO injection)
VITE_SITE_BASE_URL=https://fusionsuites.vn  ← Domain production của bạn
VITE_PROPERTY_ID=10

# Authentication
VITE_API_USERNAME=fusion@admin.com
VITE_API_PASSWORD=Fusion@Admin
```

### Bước 2: Install dependencies
```bash
npm install
```

### Bước 3: Build
```bash
npm run build
```

**Output:**
```
📋 Config:
  - API: https://travel.link360.vn/api/v1
  - Tenant: fusion
  - Property ID: 10
  - Site URL: https://fusionsuites.vn
🔄 Fetching SEO data from API...
✅ API data fetched: {...}
✅ SEO meta tags injected successfully!
📄 File: /path/to/dist/index.html
🎯 Title: Fusion Suites Vũng Tàu | Khách sạn 5 sao...
🖼️  Image: https://travel.link360.vn/api/v1/media/171/view
```

---

## Kết quả trong `dist/index.html`

Sau khi build, file `dist/index.html` sẽ có:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- ✅ META TAGS TỪ API - ĐÃ CÓ TRONG HTML TĨNH -->
  <title>Fusion Suites Vũng Tàu | Khách sạn 5 sao gần biển</title>
  <meta name="description" content="..." />
  <meta name="keywords" content="..." />
  
  <!-- Canonical URL -->
  <link rel="canonical" href="https://fusionsuites.vn" />
  
  <!-- Open Graph -->
  <meta property="og:url" content="https://fusionsuites.vn" />
  <meta property="og:site_name" content="Fusion Suites Vũng Tàu" />
  <meta property="og:title" content="..." />
  <meta property="og:image" content="https://travel.link360.vn/api/v1/media/171/view" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  
  <!-- Favicon -->
  <link rel="icon" href="https://travel.link360.vn/api/v1/media/172/view" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index-xxx.js"></script>
</body>
</html>
```

---

## Ưu điểm của Build-Time Injection

### ✅ SEO tối ưu
- **Crawlers thấy ngay meta tags** trong HTML tĩnh
- Không cần chờ JavaScript load
- Tốt cho Facebook, Google, Zalo bot

### ✅ Dữ liệu từ API
- Không hardcode meta tags
- Dễ thay đổi từ backend
- Chỉ cần build lại khi API update

### ✅ Performance
- Meta tags có sẵn trong HTML
- Không cần fetch API runtime (cho homepage)
- First contentful paint nhanh hơn

---

## Khi nào cần build lại?

Bạn CẦN build lại khi:
- ✏️ Thay đổi SEO title/description từ backend
- 🖼️ Đổi logo/favicon
- 🌐 Đổi domain (VITE_SITE_BASE_URL)
- 🔧 Cập nhật tenant/property ID

Bạn KHÔNG CẦN build lại khi:
- Thay đổi nội dung trang (content)
- Update rooms/dining/facilities data
- Thay đổi màu sắc theme

---

## Test SEO Injection

### 1. Test local sau khi build
```bash
npm run build
npm run preview
# Mở http://localhost:4173
# View page source (Ctrl+U) → kiểm tra <head>
```

### 2. Test với Facebook Debugger
```
https://developers.facebook.com/tools/debug/
```
Paste URL production → Click "Scrape Again" → Xem preview

### 3. Test với Google Rich Results
```
https://search.google.com/test/rich-results
```

---

## Troubleshooting

### ❌ Lỗi: "Cannot find module 'dotenv'"
```bash
npm install dotenv --save-dev
```

### ❌ Script không inject được
- Kiểm tra `dist/index.html` có tồn tại không
- Xem log output của script
- Kiểm tra API có trả về data không

### ❌ Facebook không thấy image mới
- Clear cache Facebook: https://developers.facebook.com/tools/debug/
- Click "Scrape Again"
- Chờ 5-10 phút

---

## Commands

```bash
# Development (không inject SEO)
npm run dev

# Build only (không inject SEO)
npm run build:only

# Build + Inject SEO (production)
npm run build

# Chỉ chạy inject script (sau khi đã build)
npm run inject-seo
```

---

## Notes

1. **Canonical URL**: 
   - Build-time: Inject cho homepage (`https://fusionsuites.vn`)
   - Runtime: React Router update theo route (`/phong-nghi`, `/am-thuc`, etc.)

2. **Image URLs**: 
   - Sử dụng absolute URLs từ API
   - Không cần base64 encode

3. **Multi-language**:
   - Hiện tại inject `vi` locale
   - Có thể mở rộng để support multi-language builds

4. **Caching**:
   - HTML tĩnh được cache bởi CDN/nginx
   - Cần purge cache sau khi deploy build mới
