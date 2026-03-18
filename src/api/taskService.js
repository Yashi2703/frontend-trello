import { apiGetMethod, apiPostMethod, apiPutMethod, apiDeleteMethod } from "./rest";
import { allApiUrl } from "./apiRoute";

export const getTasksByProjectId = (projectId) => {
    return apiGetMethod(`${allApiUrl.TASKS}?projectId=${projectId}`);
};

export const createTask = (data) => {
    return apiPostMethod(allApiUrl.TASKS, data);
};

export const updateTaskStatus = (id, status) => {
    return apiPutMethod(`${allApiUrl.TASKS}/${id}/status`, { status });
};

export const updateTask = (id, data) => {
    return apiPutMethod(`${allApiUrl.TASKS}/${id}`, data);
};

export const deleteTask = (id) => {
    return apiDeleteMethod(`${allApiUrl.TASKS}/${id}`);
};
