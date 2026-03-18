import axios from "axios";

const requestTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const apiEndpoint = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const storageKey = import.meta.env.VITE_STORAGE_PERSIST_CONFIG_KEY || "project-management-storage";

const getHeaders = (token = null, contentType = null) => {
    const header = { timeZone: requestTimeZone };

    // Attempt to get token from storage if not provided
    try {
        const clsData = JSON.parse(localStorage.getItem(`persist:${storageKey}`) || "{}");
        const parsedData = clsData?.loginReducer ? JSON.parse(clsData.loginReducer) : {};
        const bearerToken = token || parsedData?.loginUserToken;
        if (bearerToken) {
            header.Authorization = `Bearer ${bearerToken}`;
        }
    } catch (e) {
        console.error("Error parsing storage data", e);
    }

    if (contentType) {
        header["content-type"] = contentType;
    }
    return header;
};

export const apiGetMethod = (url, cancelToken = null, token = null) => {
    return new Promise((resolve, reject) => {
        const configData = {
            headers: getHeaders(token),
            ...(cancelToken && { cancelToken })
        };

        axios.get(`${apiEndpoint}${url}`, configData)
            .then(resolve)
            .catch((err) => reject(err?.response));
    });
};

export const apiPostMethodAuth = (url, data) => {
    return new Promise((resolve, reject) => {
        axios.post(`${apiEndpoint}${url}`, data)
            .then(resolve)
            .catch((err) => reject(err?.response));
    });
};

export const apiPostMethod = (url, data, cancelToken = null, contentType = null, token = "") => {
    return new Promise((resolve, reject) => {
        const configData = {
            headers: getHeaders(token, contentType),
            ...(cancelToken && { cancelToken })
        };

        axios.post(`${apiEndpoint}${url}`, data, configData)
            .then(resolve)
            .catch((err) => reject(err?.response));
    });
};

export const apiDeleteMethod = (url, cancelToken = null, token = null) => {
    return new Promise((resolve, reject) => {
        const configData = {
            headers: getHeaders(token),
            ...(cancelToken && { cancelToken })
        };

        axios.delete(`${apiEndpoint}${url}`, configData)
            .then(resolve)
            .catch((err) => reject(err?.response));
    });
};

export const apiPutMethod = (url, data, cancelToken = null, contentType = null, token = "") => {
    return new Promise((resolve, reject) => {
        const configData = {
            headers: getHeaders(token, contentType),
            ...(cancelToken && { cancelToken })
        };

        axios.put(`${apiEndpoint}${url}`, data, configData)
            .then(resolve)
            .catch((err) => reject(err?.response));
    });
};

