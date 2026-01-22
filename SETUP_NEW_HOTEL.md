# Quick Setup Script - Khách Sạn Mới

Script tự động setup project cho khách sạn mới.

## Cách Dùng

```bash
# Chạy script và làm theo hướng dẫn
node scripts/setup-new-hotel.js
```

Script sẽ hỏi:
1. Tên khách sạn
2. Tenant code
3. Property ID
4. Domain
5. API credentials

Sau đó tự động:
- Tạo file `.env`
- Test API connection
- Hiển thị next steps

---

## Manual Setup (nếu không dùng script)

### 1. Tạo `.env` file

```bash
cp .env.example .env
```

### 2. Edit `.env` với thông tin khách sạn

```env
# Khách sạn: [TÊN KHÁCH SẠN]
VITE_API_BASE_URL=https://travel.link360.vn/api/v1
VITE_TENANT_CODE=[TENANT_CODE]
VITE_PROPERTY_CODE=[PROPERTY_CODE]
VITE_SITE_BASE_URL=https://[YOUR_DOMAIN].com
VITE_PROPERTY_ID=[PROPERTY_ID]
VITE_API_USERNAME=[USERNAME]
VITE_API_PASSWORD=[PASSWORD]
```

### 3. Test API

```bash
npm run test:api
```

### 4. Development

```bash
npm install
npm run dev
```

---

## Thông Tin Cần Chuẩn Bị

Liên hệ team backend để lấy:

- ✅ **Tenant Code** - VD: `phoenix`, `fusion`, `grand`
- ✅ **Property ID** - VD: `13`, `10`, `15`
- ✅ **Property Code** - VD: `phoenix-hotel-vung-tau`
- ✅ **Domain** - VD: `https://phoenixhotelvungtau.com`
- ✅ **API Username** - VD: `phoenix@admin.com`
- ✅ **API Password** - VD: `Phoenix@Admin`

**Verify backend data:**
- Logo uploaded? (`logo_media_id`)
- Favicon uploaded? (`favicon_media_id`)
- SEO data filled? (`seo.vi.meta_title`)
- VR360 links configured? (`pages.rooms.vr360_link`)
- Pages visibility set? (`pages.*.is_displaying`)
