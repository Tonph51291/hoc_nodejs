const { env } = require("../config");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Lỗi máy chủ",
    ...(env === "development" && { stack: err.stack }),
  });
};
