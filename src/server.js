const app = require("./app");
const { port, env } = require("./config");

const server = app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port} [${env}]`);
});

// Tắt server êm khi nhận tín hiệu dừng
const shutdown = (signal) => {
  console.log(`\n${signal} nhận được, đang tắt server...`);
  server.close(() => process.exit(0));
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
