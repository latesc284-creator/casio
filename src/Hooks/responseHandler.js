export const sendResponse = (
  res,
  status,
  message,
  data = null,
  error = null,
) => {
  const response = {
    status,
    message,
    data: data || null,
    error: error || null,
  };
  res.status(status).json(response);
};
