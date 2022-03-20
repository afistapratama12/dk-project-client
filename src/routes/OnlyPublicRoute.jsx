import React from 'react'

import { Route, Redirect } from 'react-router'

function OnlyPublicRoute(props) {
    const auth = !!localStorage.getItem("access_token")

    return !auth ? <Route {...props}>{props.children}</Route> : <Redirect to="/" />
}

export { OnlyPublicRoute }
