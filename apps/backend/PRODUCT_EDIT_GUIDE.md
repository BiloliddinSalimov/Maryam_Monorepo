# Mahsulot Tahrirlash — To'liq Qo'llanma

## Umumiy Arxitektura

Mahsulot tahrirlash **4 ta mustaqil qismdan** iborat:

1. **Asosiy ma'lumotlar** — nom, narx, tavsif, stock (`PUT /admin/products/:id`)
2. **Kategoriyalar** — biriktirish / uzish (`POST/DELETE /admin/products/:id/categories`)
3. **Rasmlar** — qo'shish / o'chirish / asosiy qilish (`POST/DELETE/PATCH /admin/products/:id/images/...`)
4. **Chegirma** — alohida boshqariladi (hozircha faqat yaratishda)

> Barcha admin endpointlari uchun `Authorization: Bearer <token>` majburiy!

---

## Response Format (har doim bir xil)

Har qanday endpoint muvaffaqiyatli bo'lsa, mahsulot **to'liq** holda qaytariladi:

```json
{
  "data": {
    "id": "product-uuid",
    "name": { "uz": "iPhone 15", "ru": "Айфон 15", "en": "iPhone 15" },
    "slug": "iphone-15",
    "description": { "uz": "Tavsif...", "ru": "Описание...", "en": "Description..." },
    "price": 12000000,
    "stock": 50,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",

    "images": [
      { "id": "img-uuid-1", "url": "/uploads/main.jpg", "isMain": true,  "productId": "...", "createdAt": "..." },
      { "id": "img-uuid-2", "url": "/uploads/extra.jpg","isMain": false, "productId": "...", "createdAt": "..." }
    ],

    "categories": [
      { "id": "cat-uuid", "name": { "uz": "Telefonlar", "ru": "Телефоны", "en": "Phones" }, "slug": "telefonlar" }
    ],

    "discount": {
      "id": "disc-uuid",
      "percent": 10,
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-06-30T00:00:00.000Z",
      "productId": "..."
    }
  }
}
```

> `images` — `isMain: true` bo'lgan rasm har doim **birinchi** keladi
> `categories` — yassi array, to'g'ridan-to'g'ri category obyektlari
> `discount` — yo'q bo'lsa `null`

---

## 1. Asosiy Ma'lumotlarni Tahrirlash

```http
PUT /admin/products/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Barcha maydonlar ixtiyoriy — faqat o'zgartirmoqchilarini yuboring:**

```json
{
  "name": { "uz": "iPhone 15 Pro", "ru": "Айфон 15 Про", "en": "iPhone 15 Pro" },
  "slug": "iphone-15-pro",
  "description": { "uz": "Yangi tavsif", "ru": "Новое описание", "en": "New description" },
  "price": 15000000,
  "stock": 30,
  "isActive": true
}
```

**Faqat narxni o'zgartirish:**
```json
{ "price": 13000000 }
```

**Faqat o'chirish (isActive = false):**
```json
{ "isActive": false }
```

**Xato holatlari:**
| Status | Sabab |
|--------|-------|
| 404 | Mahsulot topilmadi |
| 409 | Slug allaqachon mavjud |

---

## 2. Kategoriya Biriktirish

```http
POST /admin/products/:id/categories
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "categoryIds": ["cat-uuid-1", "cat-uuid-2"]
}
```

> Allaqachon biriktirilgan kategoriya qayta yuborilsa — xato bo'lmaydi (skipDuplicates)

**Xato holatlari:**
| Status | Sabab |
|--------|-------|
| 404 | Mahsulot topilmadi |
| 404 | Bir yoki bir nechta kategoriya topilmadi |

---

## 3. Kategoriya Uzish

```http
DELETE /admin/products/:id/categories
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "categoryIds": ["cat-uuid-1"]
}
```

---

## 4. Rasm Qo'shish

```http
POST /admin/products/:id/images
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "urls": ["/uploads/photo1.jpg", "/uploads/photo2.jpg"]
}
```

**Muhim qoidalar:**
- Mahsulotda hech qanday rasm yo'q bo'lsa → birinchi yuborilgan rasm avtomatik `isMain: true` bo'ladi
- Allaqachon rasm bor bo'lsa → qo'shilgan rasmlar `isMain: false` bo'ladi

---

## 5. Rasm O'chirish

```http
DELETE /admin/products/:id/images/:imgId
Authorization: Bearer <token>
```

> `imgId` — o'chiriladigan rasmning UUID si (response dagi `images[].id`)

**Avtomatik qoida:**
- Asosiy rasm (`isMain: true`) o'chirilsa → qolgan rasmlardan biri avtomatik `isMain: true` bo'ladi (eng eski rasm)

**Xato holatlari:**
| Status | Sabab |
|--------|-------|
| 404 | Rasm topilmadi yoki bu mahsulotga tegishli emas |

---

## 6. Asosiy Rasm Belgilash

```http
PATCH /admin/products/:id/images/:imgId/main
Authorization: Bearer <token>
```

> Body shart emas

**Mantiq:**
1. Barcha rasmlar `isMain: false` ga o'tkaziladi
2. Tanlangan rasm `isMain: true` bo'ladi
3. Response da ushbu rasm **birinchi** o'rinda keladi

---

## To'liq Tahrirlash Jarayoni (Misol)

### Senariy: iPhone 15 ni tahrirlash

**1. Asosiy ma'lumotlarni o'zgartirish:**
```http
PUT /admin/products/product-uuid
{ "price": 13500000, "stock": 25 }
```

**2. Yangi rasm qo'shish:**
```http
POST /admin/products/product-uuid/images
{ "urls": ["/uploads/iphone15-side.jpg"] }
```

**3. Eski rasmni o'chirish (imgId oldin response dan olinadi):**
```http
DELETE /admin/products/product-uuid/images/old-img-uuid
```

**4. Yangi rasmni asosiy qilish:**
```http
PATCH /admin/products/product-uuid/images/new-img-uuid/main
```

**5. Kategoriya qo'shish:**
```http
POST /admin/products/product-uuid/categories
{ "categoryIds": ["smartphones-cat-uuid"] }
```

**6. Eski kategoriyani uzish:**
```http
DELETE /admin/products/product-uuid/categories
{ "categoryIds": ["old-cat-uuid"] }
```

---

## Barcha Endpointlar Jadvali

| Method | URL | Tavsif |
|--------|-----|--------|
| `GET` | `/api/products` | Barcha mahsulotlar (public) |
| `GET` | `/api/products/:id` | Bitta mahsulot (public) |
| `POST` | `/admin/products` | Yangi mahsulot yaratish |
| `PUT` | `/admin/products/:id` | Asosiy ma'lumotlarni tahrirlash |
| `POST` | `/admin/products/:id/images` | Rasm(lar) qo'shish |
| `DELETE` | `/admin/products/:id/images/:imgId` | Bitta rasm o'chirish |
| `PATCH` | `/admin/products/:id/images/:imgId/main` | Asosiy rasm belgilash |
| `POST` | `/admin/products/:id/categories` | Kategoriya biriktirish |
| `DELETE` | `/admin/products/:id/categories` | Kategoriya uzish |
| `DELETE` | `/admin/products/:id` | Mahsulotni o'chirish |

---

## Muhim Eslatmalar

1. `PUT /admin/products/:id` da `images` maydoni yuborilsa — **e'tiborga olinmaydi**, rasmlarni alohida endpointlar orqali boshqaring
2. `categories` response da **yassi array** — `[{ id, name, slug }]` formatida
3. `images` response da **`isMain: true` birinchi** keladi
4. Rasm URL lari upload qilingandan keyin olingan yo'llar bo'lishi kerak (`/uploads/filename.jpg`)
5. Slug berilmasa avtomatik nomdan generatsiya qilinadi (faqat yaratishda)
