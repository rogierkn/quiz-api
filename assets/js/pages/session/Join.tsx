import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import {SessionStatus, SessionType} from "../../models/Session";
import Session from "../../models/Session";
import SessionStore from "../../stores/SessionStore";
import {Loader} from "semantic-ui-react";
import {Redirect} from "react-router";
import route from "../../util/route";
import routes from "../../routes";

interface propTypes {
    match: {params: {id: string}}
    sessionStore?: SessionStore,
}

@inject('sessionStore') @observer
export default class Join extends React.Component<propTypes, any> {

    @observable session: Session;
    @observable joinedAfterStarting = false;

    async componentDidMount() {
        this.session = await this.props.sessionStore.loadByIri(Session.idToIri(this.props.match.params.id));
        this.props.sessionStore.rootStore.uiStore.isPlayingQuiz = true;
    }

    render() {

        if(!this.session) {
            return <Loader active />
        }

        if(this.session.type === SessionType.GROUP) {
            return <Redirect to={route(routes.session.play.group, {id: this.session.id})}/>
        } else if(this.session.type === SessionType.INDIVIDUAL) {
            return <Redirect to={route(routes.session.play.individual, {id: this.session.id})}/>
        }

        throw "Unexpected session type";
    }
}