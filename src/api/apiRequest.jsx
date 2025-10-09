const apiRequest = async (url = "", optionsObj = null) => {
  try {
    const response = await fetch(url, optionsObj);
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
    return { error: err.message || "Network error", status: null, data: null };
  }
};

export default apiRequest;
