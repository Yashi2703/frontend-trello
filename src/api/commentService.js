import { apiGetMethod, apiPostMethod } from "./rest";
import { allApiUrl } from "./apiRoute";

export const getCommentsByTaskId = (taskId) => {
    return apiGetMethod(`${allApiUrl.COMMENTS}?taskId=${taskId}`);
};

export const createComment = (data) => {
    return apiPostMethod(allApiUrl.COMMENTS, data);
};
