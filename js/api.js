// js/api.js - Optimized for Django/MySQL Integration
import { state } from "./state.js";

export const BASE_URL = "http://127.0.0.1:8000/api/"; 
export const MEDIA_URL = "http://127.0.0.1:8000/media/";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export async function fetchData(endpoint, method = "GET", body = null) {
  try {
    const [path, queryString] = endpoint.split('?');
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    let fullUrl = `${BASE_URL}${cleanPath}/`;

    // Build query parameters for cache busting
    const params = new URLSearchParams(queryString || '');
    
    // ✅ Add timestamp to GET requests to prevent caching
    if (method.toUpperCase() === 'GET') {
        params.set('_t', Date.now());
    }
    
    const paramString = params.toString();
    if (paramString) {
        fullUrl += `?${paramString}`;
    }

    console.log("API Request:", method, fullUrl);

    const headers = {
        "Accept": "application/json"
    };

    if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (!["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())) {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) headers["X-CSRFToken"] = csrftoken;
    }
    
    const publicEndpoints = ['login', 'activate', 'reset-password'];
    const isPublic = publicEndpoints.some(p => cleanPath.includes(p));
    
    const rawToken = state.token || localStorage.getItem("bmsToken");
    const isValidToken = rawToken && rawToken !== "null" && rawToken !== "undefined" && rawToken.length > 5;

    if (isValidToken && !isPublic) {
        headers["Authorization"] = `Token ${rawToken}`;
        console.log("Auth token added for:", cleanPath);
    }

    const options = {
      method: method.toUpperCase(),
      headers: headers,
      credentials: "include" 
    };

    if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      options.body = (body instanceof FormData) ? body : JSON.stringify(body);
    }

    const response = await fetch(fullUrl, options);

    if (response.status === 401) {
      console.warn("Session expired or invalid. Clearing session data.");
      localStorage.removeItem("bmsToken");
      localStorage.removeItem("bmsUser");
    }

    if (response.status === 204) return { success: true };

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const errorMsg = data.error || data.detail || `Error ${response.status}: Request failed.`;
      throw new Error(errorMsg);
    }
    
    console.log("API Response:", method, fullUrl, "Status:", response.status, "Data length:", Array.isArray(data) ? data.length : 'object');
    return data;
  } catch (err) {
    console.error("API Error [" + method + "] " + endpoint + ":", err.message);
    throw err; 
  }
}

export const postData = (endpoint, data) => fetchData(endpoint, 'POST', data);
export const patchData = (endpoint, data) => fetchData(endpoint, 'PATCH', data);
export const putData = (endpoint, data) => fetchData(endpoint, 'PUT', data);
export const deleteData = (endpoint) => fetchData(endpoint, 'DELETE');