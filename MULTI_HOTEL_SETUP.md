# Multi-Hotel Setup Guide

Hướng dẫn clone và setup dự án cho nhiều khách sạn khác nhau.

---

## Cơ Chế Hoạt Động

Mỗi khách sạn sẽ có:
- ✅ 1 repository riêng (hoặc branch riêng)
- ✅ 1 file `.env` riêng với config khác nhau
- ✅ 1 domain riêng
- ✅ Dùng chung source code, chỉ khác config

**Backend API** cung cấp data theo `tenant-code` và `property-id`.

---

## Bước 1: Clone Dự Án

### Option A: Clone cho khách sạn mới (Recommended)

```bash
# 1. Clone project template
git clone <repo-url> hotel-name
cd hotel-name

# 2. Đổi remote (nếu muốn push lên repo riêng)
git remote remove origin
git remote add origin <new-repo-url>

# 3. Install dependencies
npm install
```

### Option B: Fork repository

```bash
# 1. Fork trên GitHub/GitLab
# 2. Clone fork về
git clone <forked-repo-url> hotel-name
cd hotel-name

# 3. Install dependencies
npm install
```

---

## Bước 2: Config Cho Khách Sạn Mới

### 2.1 Tạo file `.env`

```bash
cp .env.example .env
```

### 2.2 Cập nhật `.env` với thông tin khách sạn

```env
# ========================================
# PHOENIX HOTEL VŨNG TÀU - CONFIG
# ========================================

# API Configuration
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_TENANT_CODE=phoenix                    # ← THAY ĐỔI cho khách sạn mới
VITE_PROPERTY_CODE=phoenix-hotel-vung-tau   # ← THAY ĐỔI cho khách sạn mới

# Site Configuration (for build-time SEO injection)
VITE_SITE_BASE_URL=https://phoenixhotelvungtau.com  # ← Domain khách sạn
VITE_PROPERTY_ID=13                         # ← ID từ backend

# Authentication
VITE_API_USERNAME=phoenix@admin.com         # ← Username từ backend
VITE_API_PASSWORD=Phoenix@Admin             # ← Password từ backend
```

### 2.3 Verify config với backend

Test API connection:
```bash
curl -X GET "https://travel.link360.vn/api/v1/vr-hotel/settings" \
  -H "X-Tenant-Code: phoenix" \
  -H "X-Property-Id: 13"
```

Phải trả về data của khách sạn mới.

---

## Bước 3: Test Local

```bash
# Development mode
npm run dev
# Mở http://localhost:5173
```

**Kiểm tra:**
- ✅ Logo/Favicon đúng không?
- ✅ Màu sắc theme đúng không?
- ✅ Tên khách sạn đúng không?
- ✅ Menu items đúng không? (theo is_displaying)
- ✅ VR360 links hoạt động không?

---

## Bước 4: Build Production

```bash
npm run build
```

**Script sẽ:**
1. Build project với Vite
2. Fetch SEO data từ API (theo tenant-code và property-id)
3. Inject meta tags vào `dist/index.html`

**Check output:**
```bash
📋 Config:
  - API: https://travel.link360.vn/api/v1
  - Tenant: phoenix                           # ✅ Đúng tenant
  - Property ID: 13                           # ✅ Đúng property
  - Site URL: https://phoenixhotelvungtau.com # ✅ Đúng domain
🔄 Fetching SEO data from API...
✅ API data fetched
✅ SEO meta tags injected successfully!
🎯 Title: Phoenix Hotel Vũng Tàu | Khách sạn 3 sao...
🖼️  Image: https://travel.link360.vn/api/v1/media/171/view
```

---

## Bước 5: Preview Build

```bash
npm run preview
# Mở http://localhost:4173
```

**View Page Source (Ctrl+U)** và check:
- `<title>` - có đúng tên khách sạn không?
- `<meta property="og:image">` - có đúng logo không?
- `<link rel="canonical">` - có đúng domain không?

---

## Bước 6: Deploy

### Option A: Deploy lên server riêng

```bash
# Upload folder dist/ lên server
scp -r dist/* user@server:/var/www/phoenixhotel/
```

### Option B: Deploy với Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Config domain
vercel domains add phoenixhotelvungtau.com
```

### Option C: Deploy với Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist

# Config domain trong Netlify dashboard
```

---

## Danh Sách File Cần Config Cho Mỗi Khách Sạn

### ✅ File BẮT BUỘC phải đổi:

| File | Nội dung thay đổi |
|------|-------------------|
| `.env` | Tenant code, property ID, domain, credentials |
| `package.json` | `name`, `version` (optional) |
| `README.md` | Tên project, description (optional) |

### ✅ File KHÔNG CẦN đổi:

- ❌ Tất cả code trong `src/`
- ❌ Tất cả components
- ❌ Tất cả hooks, services, utils
- ❌ Config files (vite.config.ts, tsconfig.json, etc.)

**Lý do:** Data từ API tự động thay đổi theo tenant-code và property-id.

---

## Example: Setup 3 Khách Sạn

### Hotel 1: Phoenix Hotel Vũng Tàu
```env
VITE_TENANT_CODE=phoenix
VITE_PROPERTY_ID=13
VITE_SITE_BASE_URL=https://phoenixhotelvungtau.com
```

### Hotel 2: Fusion Suites Vũng Tàu
```env
VITE_TENANT_CODE=fusion
VITE_PROPERTY_ID=10
VITE_SITE_BASE_URL=https://fusionsuites.vn
```

### Hotel 3: Grand Hotel Vũng Tàu
```env
VITE_TENANT_CODE=grand
VITE_PROPERTY_ID=15
VITE_SITE_BASE_URL=https://grandhotelvungtau.com
```

---

## Git Strategy

### Strategy 1: Multi-Repository (Recommended cho production)

```
fontend-hotellink-template/     # Template repo
├── phoenix-hotel/               # Clone 1
├── fusion-suites/               # Clone 2
└── grand-hotel/                 # Clone 3
```

**Ưu điểm:**
- ✅ Mỗi hotel độc lập
- ✅ Deploy riêng, không ảnh hưởng nhau
- ✅ Có thể custom riêng cho từng hotel

**Nhược điểm:**
- ❌ Update template phải manual merge
- ❌ Nhiều repo phải quản lý

### Strategy 2: Multi-Branch

```
main                  # Development
├── hotel/phoenix     # Phoenix Hotel config
├── hotel/fusion      # Fusion Suites config
└── hotel/grand       # Grand Hotel config
```

**Ưu điểm:**
- ✅ Dễ update code chung
- ✅ 1 repo dễ quản lý

**Nhược điểm:**
- ❌ Deploy phải switch branch
- ❌ Conflict nếu custom nhiều

### Strategy 3: Monorepo (Advanced)

```
hotellink-monorepo/
├── packages/
│   ├── shared/           # Shared components
│   ├── phoenix/          # Phoenix Hotel
│   ├── fusion/           # Fusion Suites
│   └── grand/            # Grand Hotel
├── package.json
└── pnpm-workspace.yaml
```

**Dùng cho:** Nhiều hotel (>5), cần share components.

---

## CI/CD Setup

### GitHub Actions Example

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_TENANT_CODE: ${{ secrets.TENANT_CODE }}
          VITE_PROPERTY_ID: ${{ secrets.PROPERTY_ID }}
          VITE_SITE_BASE_URL: ${{ secrets.SITE_BASE_URL }}
          VITE_API_USERNAME: ${{ secrets.API_USERNAME }}
          VITE_API_PASSWORD: ${{ secrets.API_PASSWORD }}
      
      - name: Deploy to Server
        run: |
          # Your deploy script here
```

**Setup GitHub Secrets:**
1. Repo → Settings → Secrets
2. Add: `TENANT_CODE`, `PROPERTY_ID`, `SITE_BASE_URL`, etc.

---

## Checklist Setup Hotel Mới

### Backend Preparation
- [ ] Tạo tenant mới trong backend
- [ ] Tạo property mới với property_id
- [ ] Upload logo, favicon lên media
- [ ] Config VR360 links
- [ ] Set is_displaying cho từng page
- [ ] Điền SEO meta (title, description, keywords)
- [ ] Tạo user authentication credentials

### Frontend Setup
- [ ] Clone repository
- [ ] Tạo `.env` với config mới
- [ ] Update tenant code, property ID
- [ ] Update site base URL (domain)
- [ ] Update API credentials
- [ ] Test API connection
- [ ] Test local development (`npm run dev`)
- [ ] Test build (`npm run build`)
- [ ] Verify meta tags trong HTML
- [ ] Test preview (`npm run preview`)

### Deploy
- [ ] Build production
- [ ] Upload lên server/CDN
- [ ] Config domain DNS
- [ ] Config SSL certificate
- [ ] Test production URL
- [ ] Test Facebook sharing (Facebook Debugger)
- [ ] Test Google SEO (Rich Results Test)

### Post-Deploy
- [ ] Monitor errors (Sentry, LogRocket)
- [ ] Check Analytics (Google Analytics)
- [ ] Test trên mobile devices
- [ ] Check loading performance (PageSpeed)

---

## Troubleshooting

### ❌ API trả về 404 Not Found
**Nguyên nhân:** Tenant code hoặc property ID sai

**Giải pháp:**
```bash
# Check tenant và property có tồn tại không
curl https://travel.link360.vn/api/v1/vr-hotel/settings \
  -H "X-Tenant-Code: phoenix" \
  -H "X-Property-Id: 13"
```

### ❌ Logo/Favicon không hiển thị
**Nguyên nhân:** Media ID sai hoặc media chưa upload

**Giải pháp:**
1. Check API response có `logo_media_id` và `favicon_media_id` không
2. Test URL: `https://travel.link360.vn/api/v1/media/171/view`
3. Upload lại media nếu cần

### ❌ Menu items không đúng
**Nguyên nhân:** Backend chưa config `is_displaying` cho pages

**Giải pháp:**
- Check API response `pages.rooms.is_displaying`, etc.
- Update backend config

### ❌ VR360 không hoạt động
**Nguyên nhân:** VR360 links chưa config hoặc sai format

**Giải pháp:**
- Check API response `pages.rooms.vr360_link`
- Verify VR360 URL có accessible không

---

## Support & Contact

Nếu cần hỗ trợ setup hotel mới:
1. Chuẩn bị thông tin: tenant code, property ID, domain
2. Test API endpoint trước
3. Liên hệ team backend nếu cần tạo tenant/property mới

---

## Quick Reference Commands

```bash
# Clone project
git clone <repo> hotel-name && cd hotel-name

# Setup
cp .env.example .env
# Edit .env with hotel config
npm install

# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Deploy
# Upload dist/ folder to server
```

---

**Tóm lại:** Chỉ cần đổi file `.env`, không cần sửa code! 🎉
