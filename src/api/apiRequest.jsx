const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

const apiRequest = async (url = "", optionsObj = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...optionsObj,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const status = response.status;
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text;
    }

    if (!response.ok) {
      const message = (data && data.message) || response.statusText || `Request failed with status ${status}`;
      return { error: message, status, data: null };
    }

    return { error: null, status, data };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      return { error: "Server connection timeout", status: null, data: null };
    }

    return { error: err.message || "Network error", status: null, data: null };
  }
};

export default apiRequest;
