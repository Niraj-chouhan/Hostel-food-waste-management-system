// Build common headers for JSON APIs.
const buildHeaders = (token, extraHeaders = {}) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: token } : {}),
  ...extraHeaders,
});

// Parse response safely even when server sends empty body.
const parseJson = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Fetch JSON and return response status with parsed data.
export const apiRequest = async (url, options = {}) => {
  const { token, body, headers, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: buildHeaders(token, headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await parseJson(response);

  return {
    ok: response.ok,
    status: response.status,
    data,
    message: data?.message,
  };
};

// Convert any API list shape into an array.
export const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.msg)) return data.msg;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};
