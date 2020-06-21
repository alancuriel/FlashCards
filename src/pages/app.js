import React from 'react'
import {Router as MyRouter} from '@reach/router'
import CardSet from '../modules/set'


const Router = () => {

    return(
        <MyRouter>
            <CardSet path="/app/card-set/:id"/>
        </MyRouter>
    )
}

export default Router;