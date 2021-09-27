
import React from 'react'
import {Route, Redirect} from 'react-router-dom'

function PrivateRoute({component: Component, ...rest}) {
    console.log("PRIVATE ROUTE aUTH PROP: ", rest.auth)
    return (
        <Route
        {...rest}
        render={(props) => rest.auth.LOADING? null: !rest.auth.AUTHENTICATED? <Redirect to={{ pathname: '/login'}} /> : <Component {...props} />}
    />
    )

    
}

export default PrivateRoute