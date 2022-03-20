import React from 'react'

import { Route, Redirect } from 'react-router'

function OnlyAdminRoute(props) {
    const role = localStorage.getItem("role")
    const id = localStorage.getItem("id")

    const auth = !!localStorage.getItem("access_token")

    return role === "admin" && id === "1" && auth ? <Route {...props}>{props.children}</Route> : <Redirect to="/" />
}

export { OnlyAdminRoute }
