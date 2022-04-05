import axios from "axios";

export const Axios = axios.create({
    baseURL: "https://dk-sas-api.onrender.com"
})

export const axiosGet = (auth, url) => {
    return Axios({
        method: "GET",
        url: url,
        headers: {
            Authorization: auth
        }
    })
}

export const axiosPost = (auth, url, insertData) => {
    return Axios({
        method: "POST",
        url: url,
        headers: {
            Authorization: auth
        },
        data: insertData
    })
}

export const axiosPatch = (auth, url, patchData) => {
    return Axios({
        method: "PATCH",
        url: url,
        headers: {
            Authorization: auth
        },
        data: patchData
    })
}

export const axiosPut = (auth, url, putData) => {
    return Axios({
        method: "PUT",
        url: url,
        headers: {
            Authorization: auth
        },
        data: putData
    })
}