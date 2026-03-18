import { apiGetMethod, apiPostMethod, apiPutMethod, apiDeleteMethod } from "./rest";
import { allApiUrl } from "./apiRoute";

export const getProjects = () => {
    return apiGetMethod(allApiUrl.PROJECTS);
};

export const createProject = (data) => {
    return apiPostMethod(allApiUrl.PROJECTS, data);
};

export const getProjectById = (id) => {
    return apiGetMethod(`${allApiUrl.PROJECTS}/${id}`);
};

export const updateProject = (id, data) => {
    return apiPutMethod(`${allApiUrl.PROJECTS}/${id}`, data);
};

export const deleteProject = (id) => {
    return apiDeleteMethod(`${allApiUrl.PROJECTS}/${id}`);
};
