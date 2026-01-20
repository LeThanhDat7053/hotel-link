# 📝 BookingForm Labels Update - Quick Guide

## ✅ Đã Hoàn Thành

- ✅ Import `useLanguage` và `getMenuTranslations`
- ✅ Thêm `const t = getMenuTranslations(locale);`
- ✅ Messages: `t.missingInfo`, `t.success`, `t.error`, `t.submit`, `t.submitting`

---

## 🔧 Cần Update (30 chỗ)

### Pattern cần thay thế:

```typescript
// ❌ CŨ:
label={<span style={labelStyle}>Họ & tên *</span>}
placeholder="Họ & tên *"
rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}

// ✅ MỚI:
label={<span style={labelStyle}>{t.fullName} *</span>}
placeholder={t.fullName + ' *'}
rules={[{ required: true, message: t.required + ' ' + t.fullName.toLowerCase() }]}
```

---

## 📋 Danh Sách Cần Thay (Line Numbers)

### 1. **Họ tên** (Line ~262)
```typescript
label={<span style={labelStyle}>{t.fullName} *</span>}
placeholder={t.fullName + ' *'}
message: t.required + ' họ tên'
```

### 2. **Số điện thoại** (Line ~275)
```typescript
label={<span style={labelStyle}>{t.phoneNumber} *</span>}
placeholder={t.phoneNumber + ' *'}
message: t.required + ' số điện thoại'
```

### 3. **Email** (Line ~288)
```typescript
label={<span style={labelStyle}>{t.emailAddress} *</span>}
placeholder={t.emailAddress}
required message: t.required + ' email'
invalidEmail message: t.invalidEmail
```

### 4. **Địa chỉ** (Line ~305)
```typescript
label={<span style={labelStyle}>{t.postalAddress}</span>}
placeholder={t.postalAddress}
```

### 5. **Quốc gia** (Line ~314)
```typescript
label={<span style={labelStyle}>{t.country}</span>}
placeholder={t.country}
```

### 6. **Ngày nhận - trả phòng** (Line ~331)
```typescript
label={<span style={labelStyle}>{t.checkInOut}</span>}
placeholder={[t.checkIn, t.checkOut]}
```

### 7. **Người lớn** (Line ~343)
```typescript
label={<span style={labelStyle}>{t.adults}</span>}
placeholder={t.adults}
```

### 8. **Trẻ em** (Line ~355)
```typescript
label={<span style={labelStyle}>{t.children}</span>}
placeholder={t.children}
```

### 9. **Loại phòng** (Line ~366)
```typescript
label={<span style={labelStyle}>{t.roomType}</span>}
placeholder={t.roomType}
```

### 10. **Số lượng phòng** (Line ~379)
```typescript
label={<span style={labelStyle}>{t.roomCount}</span>}
placeholder={t.roomCount}
```

### 11. **Yêu cầu khác** (Line ~391)
```typescript
label={<span style={labelStyle}>{t.otherRequests}</span>}
placeholder={t.otherRequests}
```

---

## 🚀 Cách Làm Nhanh

### Option 1: Find & Replace (VS Code)

```regex
# Tìm:
Họ & tên

# Thay:
{t.fullName}
```

Làm tương tự cho từng field.

### Option 2: Manual Update

Mở `BookingForm.tsx`, tìm từng field và update theo pattern trên.

---

## ✅ Kiểm Tra Sau Khi Xong

1. **Chạy TypeScript:**
   ```bash
   npm run build
   ```

2. **Test trên browser:**
   - Đổi ngôn ngữ vi → en → zh
   - Kiểm tra tất cả labels trong form đổi theo
   - Submit form xem messages có đổi không

3. **Check console không có lỗi**

---

## 💡 Lưu Ý

- **Placeholders**: Không cần dấu `:` cuối
- **Labels**: Không cần dấu `*` trong translation, thêm ngoài
- **Validation messages**: Format `t.required + ' ' + field_name`
- **Email validation**: Dùng riêng `t.invalidEmail`

---

**Estimated time**: 15-20 phút

**Priority**: Medium (form vẫn hoạt động, chỉ labels chưa đa ngôn ngữ)
