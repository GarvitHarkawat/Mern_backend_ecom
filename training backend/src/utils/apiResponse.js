const apiResponse = (statusCode, data = null, message = "Success") => ({
  success: statusCode < 400,
  statusCode,
  data,
  message,
});

module.exports = apiResponse;