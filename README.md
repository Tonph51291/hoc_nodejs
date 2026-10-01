# Node.js Base (Express)

Base project Node.js chuẩn, gọn, dễ mở rộng: tách lớp rõ ràng, xử lý lỗi tập trung, cấu hình qua `.env`.

## 1. Cấu trúc thư mục

```
node-js/
├── src/
│   ├── config/
│   │   └── index.js            # Đọc biến môi trường
│   ├── controllers/
│   │   └── health.controller.js
│   ├── middlewares/
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── index.js            # Gom tất cả route
│   │   └── health.route.js
│   ├── app.js                  # Khởi tạo Express app
│   └── server.js               # Chạy server
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 2. Cài đặt

```bash
npm init -y
npm install express dotenv cors helmet morgan
npm install -D nodemon
```

## 3. package.json

```json
{
  "name": "node-js",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

> Giữ nguyên phần `dependencies` / `devDependencies` do npm tự sinh ra.

## 4. Code

### `.env` và `.env.example`

```env
NODE_ENV=development
PORT=3000
```

### `.gitignore`

```
node_modules
.env
```

### `src/config/index.js`

```js
require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
};
```

### `src/app.js`

```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

### `src/server.js`

```js
const app = require('./app');
const { port, env } = require('./config');

const server = app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port} [${env}]`);
});

// Tắt server êm khi nhận tín hiệu dừng
const shutdown = (signal) => {
  console.log(`\n${signal} nhận được, đang tắt server...`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```

### `src/routes/index.js`

```js
const router = require('express').Router();

router.use('/health', require('./health.route'));

module.exports = router;
```

### `src/routes/health.route.js`

```js
const router = require('express').Router();
const { check } = require('../controllers/health.controller');

router.get('/', check);

module.exports = router;
```

### `src/controllers/health.controller.js`

```js
exports.check = (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};
```

### `src/middlewares/notFound.js`

```js
module.exports = (req, res, next) => {
  const err = new Error(`Không tìm thấy: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};
```

### `src/middlewares/errorHandler.js`

```js
const { env } = require('../config');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Lỗi máy chủ',
    ...(env === 'development' && { stack: err.stack }),
  });
};
```

## 5. Chạy thử

```bash
npm run dev
```

Mở trình duyệt: <http://localhost:3000/api/health>

Kết quả mong đợi:

```json
{ "status": "ok", "uptime": 1.23, "timestamp": "2026-10-01T14:20:00.000Z" }
```

## 6. Thêm một route mới (quy trình)

1. Tạo `src/controllers/user.controller.js` chứa logic.
2. Tạo `src/routes/user.route.js` khai báo endpoint.
3. Đăng ký trong `src/routes/index.js`:
   ```js
   router.use('/users', require('./user.route'));
   ```

## 7. Gợi ý bước tiếp theo

- Kết nối database: `mongoose` (MongoDB) hoặc `prisma` / `sequelize` (SQL)
- Validate dữ liệu: `zod` hoặc `joi`
- Xác thực: `jsonwebtoken` + `bcrypt`
- Lint/format: `eslint` + `prettier`
- Test: `jest` + `supertest`
