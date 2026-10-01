module.exports = (req, res, next) => {
  const err = new Error(`Không tìm thấy: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};
