
import React from 'react'
import {Route, Redirect} from 'react-router-dom'

function PrivateRoute({component: Component, ...rest}) {
    return (
        <Route
        {...rest}
        render={(props) => rest.auth.LOADING? null: !rest.auth.AUTHENTICATED? <Redirect to={{ pathname: '/login'}} /> : <Component {...props} />}
    />
    )

    
}

export default PrivateRoute