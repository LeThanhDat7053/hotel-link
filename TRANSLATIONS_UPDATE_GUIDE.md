# 🌐 Hướng Dẫn Hoàn Thiện Đa Ngôn Ngữ

## ✅ Đã Hoàn Thành

### 1. **Interface & Translations**  
✅ File: [`src/constants/translations.ts`](src/constants/translations.ts)

**Đã làm:**
- ✅ Thêm 45 keys mới vào interface `MenuTranslations`:
  - Common UI: `back`, `bookNow`, `pricePerNight`, `capacity`, `area`, `floor`, `bedType`, `amenities`, `description`, `images`
  - Facility/Service: `operatingHours`, `availability`, `priceInfo`, `notAvailable`
  - Contact: `address`, `email`, `phone`, `website`, `workingHours`
  - Booking Form: `fullName`, `phoneNumber`, `emailAddress`, `postalAddress`, `country`, `checkInOut`, `checkIn`, `checkOut`, `adults`, `children`, `roomType`, `roomCount`, `otherRequests`, `submit`, `submitting`
  - Messages: `required`, `invalidEmail`, `missingInfo`, `success`, `error`, `loading`, `notFound`, `errorLoading`

- ✅ Hoàn thành translations cho 2 ngôn ngữ:
  - **Tiếng Việt (vi)**: 57 keys đầy đủ
  - **English (en)**: 57 keys đầy đủ
  - **Arabic (ar)**: 57 keys đầy đủ
  - **German (de)**: 57 keys đầy đủ
  - **Spanish (es)**: 57 keys đầy đủ
  - **French (fr)**: 57 keys đầy đủ

### 2. **Components**
✅ **RoomDetail**: 
- Đã import `useLanguage`
- Đã thay thế 1 số hardcoded text thành `t.back`, `t.errorLoading`

---

## 🔧 CẦN HOÀN THIỆN

### 1. **Translations (14 ngôn ngữ còn lại)**

Cần bổ sung đầy đủ 57 keys cho các ngôn ngữ:
- `hi` (Hindi - हिंदी)
- `id` (Indonesian - Bahasa Indonesia)  
- `it` (Italian - Italiano)
- `ja` (Japanese - 日本語)
- `ko` (Korean - 한국어)
- `ms` (Malay - Bahasa Melayu)
- `pt` (Portuguese - Português)
- `ru` (Russian - Русский)
- `ta` (Tamil - தமிழ்)
- `th` (Thai - ภาษาไทย)
- `tl` (Filipino/Tagalog)
- `hk` / `yue` (Cantonese - 粵語)
- `zh-CN` / `zh` (Chinese Simplified - 简体中文)
- `zh-TW` (Chinese Traditional - 繁體中文)

**Mẫu cần điền** (copy format từ `en`):
```typescript
hi: {
  about: 'परिचय',
  rooms: 'कमरे',
  // ... 12 keys menu ...
  
  // Common UI (10 keys)
  back: 'वापस',
  bookNow: 'अभी बुक करें',
  pricePerNight: 'प्रति रात कीमत',
  capacity: 'क्षमता',
  area: 'क्षेत्र',
  floor: 'मंजिल',
  bedType: 'बिस्तर प्रकार',
  amenities: 'सुविधाएं',
  description: 'विवरण',
  images: 'चित्र',
  
  // Facility/Service (4 keys)
  operatingHours: 'खुलने का समय',
  availability: 'उपलब्धता',
  priceInfo: 'कीमत',
  notAvailable: 'उपलब्ध नहीं',
  
  // Contact (5 keys)
  address: 'पता',
  email: 'ईमेल',
  phone: 'फोन',
  website: 'वेबसाइट',
  workingHours: 'काम के घंटे',
  
  // Booking Form (14 keys)
  fullName: 'पूरा नाम',
  phoneNumber: 'फोन नंबर',
  emailAddress: 'ईमेल',
  postalAddress: 'पता',
  country: 'देश',
  checkInOut: 'चेक-इन - चेक-आउट',
  checkIn: 'चेक-इन',
  checkOut: 'चेक-आउट',
  adults: 'वयस्क',
  children: 'बच्चे',
  roomType: 'कमरे का प्रकार',
  roomCount: 'कमरों की संख्या',
  otherRequests: 'अन्य अनुरोध',
  submit: 'बुक करें',
  submitting: 'भेज रहे हैं...',
  
  // Messages (8 keys)
  required: 'कृपया दर्ज करें',
  invalidEmail: 'अमान्य ईमेल',
  missingInfo: 'जानकारी गुम',
  success: 'बुकिंग सफल! हम जल्द ही आपसे संपर्क करेंगे।',
  error: 'कोई त्रुटि हुई। कृपया पुनः प्रयास करें।',
  loading: 'लोड हो रहा है...',
  notFound: 'नहीं मिला',
  errorLoading: 'डेटा लोड करने में त्रुटि',
},
```

**Công cụ gợi ý:** Sử dụng Google Translate hoặc DeepL để dịch nhanh, sau đó review lại.

---

### 2. **Update Components**

#### A. **RoomDetail** - `src/components/common/RoomDetail.tsx`

**Đã có:**
```typescript
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';

const { locale } = useLanguage();
const t = getMenuTranslations(locale);
```

**⚠️ QUAN TRỌNG:** `useLanguage()` chỉ trả về `locale`, không có `t` object! Phải dùng `getMenuTranslations(locale)` để lấy translations.

**Cần thay thế:**
```typescript
// Lines 194, 221, 253
'Quay lại' → t.back

// Line 198-199
title="Lỗi tải dữ liệu"
message={error.message || 'Không thể tải thông tin phòng...'}
→
title={t.errorLoading}
message={error.message || t.errorLoading}

// Line 220-221
title="Không tìm thấy phòng"
message="Thông tin phòng không tồn tại..."
→
title={t.notFound}
message={t.notFound}

// Line 268
'Giá phòng' → t.pricePerNight

// Line 282
'Đặt ngay' → t.bookNow

// Line 292
'Sức chứa' → t.capacity

// Line 298
'Diện tích' → t.area

// Line 304
'Tầng' → t.floor

// Line 310
'Loại giường' → t.bedType

// Line 318
'Tiện nghi phòng' → t.amenities

// Line 337
'Hình ảnh' → t.images
```

---

#### B. **FacilityDetail** - `src/components/common/FacilityDetail.tsx`

**1. Thêm imports:**
```typescript
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
```

**2. Trong component:**
```typescript
const { locale } = useLanguage();
const t = getMenuTranslations(locale);
```

**3. Thay thế:**
```typescript
// 'Quay lại' buttons → t.back (có 3 chỗ)

// 'Lỗi tải dữ liệu' → t.errorLoading
// 'Không tìm thấy' → t.notFound

// 'Hình ảnh' → t.images
```

**4. ✨ HIỂN THỊ `operating_hours` TỪ API:**

Tìm dòng hiển thị facility info, thêm:
```typescript
{/* Operating Hours - từ API */}
{facility.operatingHours && (
  <div style={infoItemStyle}>
    <span>{t.operatingHours}: <strong>{facility.operatingHours}</strong></span>
  </div>
)}
```

**API response structure:**
```json
{
  "operating_hours": "7:00 - 18:00",
  // ...
}
```

---

#### C. **ServiceDetail** - `src/components/common/ServiceDetail.tsx`

**1. Thêm imports:**
```typescript
import { useLanguage } from '../../context/LanguageContext';
import { getMenuTranslations } from '../../constants/translations';
```

**2. Trong component:**
```typescript
const { locale } = useLanguage();
const t = getMenuTranslations(locale);
```

**3. Thay thế:**
```typescript
// 'Quay lại' → t.back
```

**4. ✨ HIỂN THỊ `availability` VÀ `price_info` TỪ API:**

Tìm phần hiển thị service info, thêm:
```typescript
{/* Availability - từ API */}
{service.availability && (
  <div style={infoItemStyle}>
    <span>{t.availability}: <strong>{service.availability}</strong></span>
  </div>
)}

{/* Price Info - từ API */}
{service.priceInfo && (
  <div style={infoItemStyle}>
    <span>{t.priceInfo}: <strong>{service.priceInfo}</strong></span>
  </div>
)}
```

**API response structure:**
```json
{
  "availability": "09:00 - 21:00",
  "price_info": "5000000",
  // ...
}
```

---

#### D. **DiningDetail** - `src/components/common/DiningDetail.tsx`

**1. Thêm imports:**
import { getMenuTranslations } from '../../constants/translations';
```

**2. Trong component:**
```typescript
const { locale } = useLanguage();
const t = getMenuTranslations(locale
```typescript
const { t } = useLanguage();
```

**3. Thay thế:**
```typescript
// Line 169: 'Quay lại' → t.back
// Line 184: 'Hình ảnh' → t.images
```

---

#### E. **ContactContent** - `src/components/common/ContactContent.tsx`

**1. Thêm imports:**
import { getMenuTranslations } from '../../constants/translations';
```

**2. Trong component:**
```typescript
const { locale } = useLanguage();
const t = getMenuTranslations(locale
```typescript
const { t } = useLanguage();
```

**3. Thay thế:**
```typescript
// Line 103: 'Email:' → t.email + ':'
// Line 110: 'Điện thoại:' → t.phone + ':'
// Line 119: 'Website:' → t.website + ':'
// Line 126: 'Giờ làm việc:' → t.workingHours + ':'

// Line 107, 115: 'Chưa cập nhật' → t.notAvailable
```

---

#### F. **BookingForm** - `src/components/common/BookingForm.tsx` ⚠️ NHIỀU NHẤT

**1. Thêm imports:**
import { getMenuTranslations } from '../../constants/translations';
```

**2. Trong component:**
```typescript
const { locale } = useLanguage();
const t = getMenuTranslations(locale
```typescript
const { t } = useLanguage();
```

**3. Thay thế toàn bộ labels & placeholders:**

```typescript
// Line 258: 'Họ & tên *' → t.fullName + ' *'
// Placeholder: 'Họ & tên *' → t.fullName + ' *'

// Line 267: 'Số điện thoại *' → t.phoneNumber + ' *'
// Placeholder: 'Số điện thoại *' → t.phoneNumber + ' *'

// Line 276: 'Email *' → t.emailAddress + ' *'
// Placeholder: 'Email' → t.emailAddress

// Line 292: 'Địa chỉ' → t.postalAddress
// Placeholder: 'Địa chỉ' → t.postalAddress

// Line 301: 'Quốc gia' → t.country
// Placeholder: 'Quốc gia' → t.country

// Line 318: 'Ngày nhận - trả phòng' → t.checkInOut
// Placeholders: ['Nhận phòng', 'Trả phòng'] → [t.checkIn, t.checkOut]

// Line 330: 'Người lớn' → t.adults
// Placeholder: 'Người lớn' → t.adults

// Line 342: 'Trẻ em' → t.children
// Placeholder: 'Trẻ em' → t.children

// Line 353: 'Loại phòng' → t.roomType
// Placeholder: 'Loại phòng' → t.roomType

// Line 366: 'Số lượng phòng' → t.roomCount
// Placeholder: 'Số lượng phòng' → t.roomCount

// Line 378: 'Yêu cầu khác' → t.otherRequests
// Placeholder: 'Yêu cầu khác' → t.otherRequests

// Line 431: 'Đặt phòng' → t.submit
// Line 431: 'Đang gửi...' → t.submitting
```

**4. Thay thế validation messages:**

```typescript
// Line 258, 268, 277: message: 'Vui lòng nhập...' → message: t.required + '...'
// Line 279: message: 'Email không hợp lệ' → message: t.invalidEmail

// Line 128: 'Thiếu thông tin' → t.missingInfo

// Line 135: message.success('Đặt phòng thành công!...') 
//        → message.success(t.success)

// Line 138: message.error('Có lỗi xảy ra...') 
//        → message.error(t.error)
```

---

## 📊 Checklist Hoàn Thành

### Translations:
- [x] Interface `MenuTranslations` (57 keys)
- [x] Tiếng Việt (vi)
- [x] English (en)
- [x] Arabic (ar)
- [x] German (de)
- [x] Spanish (es)
- [x] French (fr)
- [ ] Hindi (hi)
- [ ] Indonesian (id)
- [ ] Italian (it)
- [ ] Japanese (ja)
- [ ] Korean (ko)
- [ ] Malay (ms)
- [ ] Portuguese (pt)
- [ ] Russian (ru)
- [ ] Tamil (ta)
- [ ] Thai (th)
- [ ] Filipino (tl)
- [ ] Cantonese (hk/yue)
- [ ] Chinese Simplified (zh-CN/zh)
- [ ] Chinese Traditional (zh-TW)

### Components:
- [ ] RoomDetail (partially done)
- [ ] FacilityDetail + show `operating_hours`
- [ ] ServiceDetail + show `availability` + `price_info`
- [ ] DiningDetail
- [ ] ContactContent
- [ ] BookingForm (nhiều nhất ~30 chỗ)

---

## 🚀 Cách Test

1. **Chạy build:**
```bash
npm run build
```

2. **Test từng ngôn ngữ:**
- Vào website
- Đổi ngôn ngữ: `vi` → `en` → `zh` → `ar`
- Kiểm tra:
  - ✅ Menu đổi ngôn ngữ
  - ✅ Nút "Quay lại" / "Back" / "返回" / "رجوع"
  - ✅ Form labels đổi theo
  - ✅ Giá phòng, sức chứa, etc. đổi theo
  - ✅ Dữ liệu từ API (tên, mô tả) giữ nguyên ngôn ngữ từ `translations` field

3. **Kiểm tra API data (Rooms, Facilities, Services):**
- **Phòng nghỉ:**
  - ✅ Hiển thị giá, sức chứa, diện tích với label đa ngôn ngữ
  - ✅ Tên phòng + mô tả từ API `translations[locale]`
  
- **Tiện ích:**
  - ✅ Hiển thị "Giờ mở cửa: 7:00 - 18:00" (từ API `operating_hours`)
  - ✅ Tên + mô tả từ API `translations[locale]`
  
- **Dịch vụ:**
  - ✅ Hiển thị "Thời gian phục vụ: 09:00 - 21:00" (từ API `availability`)
  - ✅ Hiển thị "Giá dịch vụ: 5000000" (từ API `price_info`)
  - ✅ Tên + mô tả từ API `translations[locale]`

---

## 🎯 Ưu Tiên

**Nếu thời gian có hạn, làm theo thứ tự:**

1. **Hoàn thiện translations cho ngôn ngữ quan trọng:**  
   - Chinese (zh-CN, zh-TW) - khách Trung Quốc nhiều
   - Korean (ko) - khách Hàn Quốc
   - Japanese (ja) - khách Nhật

2. **Update components theo độ ưu tiên:**
   - RoomDetail (quan trọng nhất - trang chi tiết phòng)
   - BookingForm (form đặt phòng)
   - FacilityDetail + ServiceDetail (hiển thị giờ mở cửa, giá)
   - ContactContent
   - DiningDetail

3. **Test trên production:**
   - Deploy lên DirectAdmin
   - Test đổi ngôn ngữ xem có lỗi console không
   - Kiểm tra CORS đã fix chưa

---

## 💡 Tips

- **Copy-paste nhanh:** Dùng Google Sheets để dịch hàng loạt, sau đó paste vào code
- **Regex replace:** Dùng VS Code Find & Replace với regex để thay nhanh:
  ```
  Find: 'Quay lại'
  Replace: {t.back}
  ```
- **Git commit từng file:** Để dễ review và rollback nếu có lỗi
- **Test ngay sau mỗi component:** Không đợi làm hết mới test

---

## 📝 Notes

- **Dữ liệu từ API KHÔNG ĐỔI:** 
  - `room.name`, `facility.description`, `service.name` → lấy từ `translations[locale]` của API
  - Backend đã xử lý đa ngôn ngữ cho content này
  
- **Chỉ đổi UI labels/buttons/placeholders:**
  - "Giá phòng", "Đặt ngay", "Quay lại", v.v.
  - Form labels, validation messages
  
- **API fields mới hiển thị:**
  - Facilities: `operating_hours` ✨
  - Services: `availability`, `price_info` ✨
  - Rooms: đã hiển thị đầy đủ

---

## 🆘 Troubleshooting

**Lỗi TypeScript:** `Property 'back' does not exist on type 'MenuTranslations'`  
→ Chạy lại TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

**Translations không hiển thị:**  
→ Kiểm tra `locale` đang active: `console.log(locale)` trong component

**Một số ngôn ngữ hiển thị ký tự lạ:**  
→ Đảm bảo file `.ts` lưu với encoding UTF-8

---

**Good luck! 🚀**
