import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import routes from "../routes";
import AuthStore from "../stores/AuthStore";
import {RouteComponentProps, withRouter} from "react-router";
import {Header} from "semantic-ui-react";

interface propTypes {
    authStore?: AuthStore
}

@inject('authStore') @observer
 class Fallback extends React.Component<propTypes & RouteComponentProps<any>, any> {

    componentDidMount() {
        if(this.props.authStore.user.roles.includes("ROLE_TEACHER")) {
            this.props.history.push(routes.general.quizzes);
            return;
        }

        if(this.props.authStore.user.roles.includes("ROLE_ADMIN")) {
            this.props.history.push(routes.admin.quizzes);
            return;
        }
    }


    render() {
        return <Header textAlign="center">
            {!this.props.authStore.user.roles.includes("ROLE_TEACHER") && <span>You can safely logout.</span>}
        </Header>
    }
}

export default withRouter(Fallback);