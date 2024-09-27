
import React from 'react'
import {Route, Redirect} from 'react-router-dom'

function PublicRoute({component: Component, ...rest}) {
    return (
        <Route
            {...rest}
            render={(props) => !rest.auth.AUTHENTICATED ? <Component {...props} /> : <Redirect to={{ pathname: '/'}} />}
        />
    )
}

export default PublicRoute