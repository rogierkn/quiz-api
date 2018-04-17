import * as React from "react";
import {observable} from "mobx";
import {inject, observer} from "mobx-react";
import SessionStore from "../../stores/SessionStore";
import Session, {SessionStatus, SessionType} from "../../models/Session";
import {History} from "history";
import routes from "../../routes";
import route from "../../util/route";
import {Button} from "semantic-ui-react";

interface propTypes {
    session: Session,
    sessionStore?: SessionStore,
    history: History
}

@inject('sessionStore') @observer
export default class SessionListActions extends React.Component<propTypes, any> {



    goToResults = () => {
        this.props.history.push(route(routes.session.results, {id: this.props.session.id}));
    };

    goToShare = () => {
        this.props.history.push(route(routes.session.share, {id: this.props.session.id}));
    };

    render() {
        const session = this.props.session;

        return <div>

            {session.status === SessionStatus.FINISHED &&
            <Button circular onClick={this.goToResults} color="blue" icon="bar chart"/>}

            {
                session.type === SessionType.INDIVIDUAL &&
                session.status === SessionStatus.OPEN &&
                <Button circular onClick={this.goToShare} icon="share"/>
            }
        </div>
    }
}