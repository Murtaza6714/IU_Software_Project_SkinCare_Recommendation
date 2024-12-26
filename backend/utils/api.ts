import axios from 'axios'

export class Apis {

    static async post(url: string, data: {}, isInternal = true) {
        try {
            const payload: any = {
                url,
                data,
                method : 'post',
                headers: {
                    'content-type': 'application/json'
                }
            };
            // if (isInternal) {
            //     payload.headers.accessKey = config.serverAuth.secret
            // }
            let result = await axios(payload);
            return result.data;
        } catch (error: any) {
            const errorRes: any = new Error(error.response.data.message);
            errorRes.statusCode = error.response.data.statusCode;
            errorRes.data = error.response.data.error;
            throw errorRes;
        }
    }

    static async get(url: string, params = '', isInternal = true) {
        try {
            const qs      = params;
            const payload: any = {
                params : qs,
                method : 'get',
                headers: {
                    'content-type': 'application/json'
                },
            };
            // if (isInternal) {
            //     payload.headers.accessKey = serverAuth.secret
            // }
            let result = await axios.get(url, payload);
            return result.data;
        } catch (error: any) {
            const errorRes: any = new Error(error.response.data.message);
            errorRes.statusCode = error.response.data.statusCode;
            errorRes.data = error.response.data.error;
            throw errorRes;
        }
    }
};