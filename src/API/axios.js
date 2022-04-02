import axios from "axios";

// https://dk-project-api.onrender.com

//TODO: get env file SERVICE_URL
export const Axios = axios.create({
    baseURL: "http://localhost:8080"
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