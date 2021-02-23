import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types';

//protección de rutas


export const PrivateRoute = ({
    isLoggedIn,
    component: Component,
    ...rest //resto de los elementos de esa manera puedo pasarselo al componente de la manera que quiero
}) => {

    return (
        <Route { ...rest }

            component={ (props) => (
                (isLoggedIn )
                    ? ( <Component { ...props } /> ) 
                    : ( <Redirect to="/login" /> )
            )
            }

        />
    )
}

PrivateRoute.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
}
