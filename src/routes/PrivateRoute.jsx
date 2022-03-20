import { Redirect, Route } from "react-router-dom"

function PrivateRoute(props) {
    const auth = !!localStorage.getItem("access_token")

    return auth ? <Route {...props}>{props.children}</Route> : <Redirect to="/login" />
}

export { PrivateRoute }