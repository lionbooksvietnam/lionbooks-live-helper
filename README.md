# Live Support Flashcards - Lionbooks

Ứng dụng hỗ trợ nhân viên khi Livestream bán hàng.

## Tính năng

- 🎯 **20 thẻ nhắc bài** với nội dung đầy đủ về sản phẩm
- 🏷️ **Lọc theo Tag**: 0-3 tuổi, Tập nói, Bồi cứng, Tết, Bestseller...
- 🎲 **Random thẻ** khi click vào tag
- ⬅️➡️ **Điều hướng** Back/Next qua các thẻ đã lọc
- 📱 **Responsive** - hoạt động tốt trên mobile

## Cài đặt

### 1. Cài Node.js

Tải và cài Node.js từ: https://nodejs.org/

### 2. Cài dependencies

```bash
cd live-helper
npm install
```

### 3. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: http://localhost:5173

### 4. Build production

```bash
npm run build
```

Files sẽ được tạo trong thư mục `dist/`

## Cấu trúc thẻ nhắc bài

Mỗi thẻ bao gồm:
- **Tên sản phẩm**
- **Pain point**: Nỗi lo của khách hàng
- **Điểm nổi bật**: USP sản phẩm
- **Script gợi ý**: Câu nói mẫu khi livestream

## Thêm thẻ mới

Mở file `src/App.jsx`, tìm mảng `flashcards` và thêm object mới:

```javascript
{
  id: 21,
  tags: ['0-3 tuổi', 'Tag khác'],
  noidung: `📚 **TÊN SẢN PHẨM**

🎯 **Pain point:** Nỗi lo của khách?

✨ **Điểm nổi bật:**
• Điểm 1
• Điểm 2

💬 **Script:** "Câu nói gợi ý..."`
}
```

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
