# Test SEO Injection Script

## Quick Test (không cần build full)

### 1. Tạo mock dist/index.html để test
```bash
mkdir -p dist
echo '<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Original Title</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>' > dist/index.html
```

### 2. Test inject script
```bash
npm run inject-seo
```

### 3. Kiểm tra kết quả
```bash
cat dist/index.html
# Hoặc mở file dist/index.html bằng editor
```

**Kỳ vọng:** Sẽ thấy meta tags mới được inject sau viewport meta tag

---

## Full Build Test

### 1. Build toàn bộ project
```bash
npm run build
```

Script sẽ tự động:
- Compile TypeScript
- Build với Vite
- Chạy inject-seo.js

### 2. Preview kết quả
```bash
npm run preview
```

Mở http://localhost:4173 và View Page Source (Ctrl+U)

---

## Verify Meta Tags

### Check trong browser
1. Mở trang
2. Right click → View Page Source (hoặc Ctrl+U)
3. Tìm trong `<head>` section:
   - `<title>` - từ API
   - `<meta name="description">` - từ API
   - `<link rel="canonical">` - site base URL
   - `<meta property="og:image">` - logo từ API
   - `<link rel="icon">` - favicon từ API

### Check với curl
```bash
curl https://fusionsuites.vn | grep -A 20 "<head>"
```

### Facebook Debugger
```
https://developers.facebook.com/tools/debug/
```
Paste URL và check preview

---

## Expected Output

### Console output khi chạy inject-seo
```
📋 Config:
  - API: https://travel.link360.vn/api/v1
  - Tenant: fusion
  - Property ID: 10
  - Site URL: https://fusionsuites.vn
🔄 Fetching SEO data from API...
✅ API data fetched: {
  primary_color: '#c2b07f',
  booking_url: '...',
  logo_media_id: 171,
  favicon_media_id: 172,
  seo: { vi: { ... } }
}
✅ SEO meta tags injected successfully!
📄 File: /path/to/dist/index.html
🎯 Title: Fusion Suites Vũng Tàu | Khách sạn 5 sao
🖼️  Image: https://travel.link360.vn/api/v1/media/171/view
```

### HTML output (trong dist/index.html)
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- ✅ INJECTED META TAGS -->
  <title>Fusion Suites Vũng Tàu | Khách sạn 5 sao gần biển</title>
  <meta name="description" content="Fusion Suites Vũng Tàu..." />
  <meta name="keywords" content="khách sạn, Vũng Tàu, ..." />
  
  <link rel="canonical" href="https://fusionsuites.vn" />
  
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://fusionsuites.vn" />
  <meta property="og:title" content="..." />
  <meta property="og:image" content="https://travel.link360.vn/api/v1/media/171/view" />
  
  <link rel="icon" href="https://travel.link360.vn/api/v1/media/172/view" />
  
  <script type="module" src="/assets/index-xxx.js"></script>
</head>
```

---

## Troubleshooting

### ❌ Error: Cannot find file dist/index.html
**Giải pháp:**
```bash
npm run build:only  # Build trước
npm run inject-seo  # Sau đó inject
```

### ❌ Error: Cannot find module 'dotenv'
**Giải pháp:**
```bash
npm install dotenv --save-dev --legacy-peer-deps
```

### ❌ API không trả về data
**Check:**
1. `.env` file có đúng config không?
2. API endpoint có chạy không?
3. Tenant code, property ID có đúng không?
4. Network có kết nối được API không?

**Test API manually:**
```bash
curl -X GET "https://travel.link360.vn/api/v1/vr-hotel/settings" \
  -H "X-Tenant-Code: fusion" \
  -H "X-Property-Id: 10"
```

### ❌ Meta tags không inject được
**Check:**
1. File dist/index.html có tồn tại không?
2. Có viewport meta tag không? (script inject sau viewport)
3. Permission để write file?

**Debug:**
```bash
# Check file tồn tại
ls -la dist/index.html

# Check nội dung file trước khi inject
cat dist/index.html
```
