const apiError = (
  statusCode,
  message = "something went wrong",
  errors = [],
) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.errors = errors;
  err.success = false;
  err.isApiError = true;
  return err;
};
module.exports = apiError;