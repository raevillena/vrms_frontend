
import React from 'react'
import {Route, Redirect} from 'react-router-dom'

function PrivateRoute({component: Component, ...rest}) {
    console.log("isAuth: ",rest.isAuthenticated)
    return (
        <Route
            {...rest}
            render={(props) => rest.isAuthenticated ? <Component {...props} /> : <Redirect to={{ pathname: '/login'}} />}
            
        />
    )
}

export default PrivateRoute