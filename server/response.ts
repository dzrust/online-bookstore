import {APIResponse} from "../models/response";
export const  createResponse = (data: any, status: number): string => {
    let response: APIResponse = {
        data,
        status
    };
    return JSON.stringify(response);
}