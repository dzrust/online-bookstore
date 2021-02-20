import { APIResponse } from "../models/response";

class API {
    private defaultBlock: RequestInit = {
        headers: new Headers({ 'content-type': 'application/json' }),
        mode: "cors",
    }
    post = async (url: string, body?: any, requestInit?: RequestInit): Promise<APIResponse> => {
        let init = requestInit ?? this.defaultBlock;
        if (body) {
            init.body = JSON.stringify(body);
        }
        init.method = "POST";
        const response = await fetch(url, init);
        return await response.json();
    }
    get = async (url: string, requestInit?: RequestInit): Promise<APIResponse> => {
        let init = requestInit ?? this.defaultBlock;
        init.method = "GET";
        const response = await fetch(url, init);
        return await response.json();
    }
    put = async (url: string, body?: any, requestInit?: RequestInit): Promise<APIResponse> => {
        let init = requestInit ?? this.defaultBlock;
        if (body) {
            init.body = JSON.stringify(body);
        }
        init.method = "PUT";
        const response = await fetch(url, init);
        return await response.json();
    }
    delete = async (url: string, body?: any, requestInit?: RequestInit): Promise<APIResponse> => {
        let init = requestInit ?? this.defaultBlock;
        if (body) {
            init.body = JSON.stringify(body);
        }
        init.method = "DELETE";
        const response = await fetch(url, init);
        return await response.json();
    }

}

const Api = new API();
export default Api;