import axios from "axios";
export const commonAPI = async (httpRequest, url, reqBody, reqHeader) => {
    const token = localStorage.getItem("token")
    const reqConfig = {
        method: httpRequest,
        url: url,
        data: reqBody,
        headers: reqHeader ? reqHeader : {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };
    return await axios(reqConfig)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err;
        });
}
