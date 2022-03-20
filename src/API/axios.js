import axios from "axios";

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

export const axiosPatch = (auth, url, insertData) => {
    return Axios({
        method: "PATCH",
        url: url,
        headers: {
            Authorization: auth
        },
        data: insertData
    })
}