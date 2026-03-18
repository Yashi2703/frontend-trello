import { apiGetMethod } from "./rest";
import { allApiUrl } from "./apiRoute";

export const getMembers = () => {
    return apiGetMethod(allApiUrl.MEMBERS);
};
