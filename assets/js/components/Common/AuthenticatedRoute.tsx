import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import {Redirect, Route, RouteProps} from "react-router";
import AuthStore from "../../stores/AuthStore";
import routes from "../../routes";


interface propTypes {
    authStore?: AuthStore
}

@inject('authStore') @observer
export default class AuthenticatedRoute extends React.Component<propTypes & RouteProps, any> {
    render() {
        if(!this.props.authStore.authenticated && this.props.authStore.token === null) {
            this.props.authStore.afterAuthGoTo = this.props.location.pathname;
            return <Redirect to={routes.general.authenticate} />
        }

        return <Route {...this.props}/>
    }
}