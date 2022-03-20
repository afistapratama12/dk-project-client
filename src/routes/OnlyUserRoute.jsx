import { Redirect, Route } from "react-router-dom"

function OnlyUserRoute(props) {
    const role = localStorage.getItem("role")
    const id = localStorage.getItem("id")

    const auth = !!localStorage.getItem("access_token")

    return role === 'user' && id !== 1 && auth ? <Route {...props}>{props.children}</Route> : <Redirect to="/admin" />
}

export { OnlyUserRoute }