import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import SessionStore from "../../stores/SessionStore";
import GroupPlaying from "../../components/Session/GroupPlaying";
import Session, {SessionStatus} from "../../models/Session";
import {Header, Container, Loader} from "semantic-ui-react";
import UiStore from "../../stores/UiStore";

interface propTypes {
    match: { params: { id: string } },
    sessionStore?: SessionStore,
    uiStore?: UiStore
}


@inject("sessionStore", "uiStore") @observer
export default class PlayGroup extends React.Component<propTypes, any> {

    @observable session: Session;
    @observable joinedAfterStarting = false;

    async componentDidMount() {
        this.props.uiStore.isPlayingQuiz = true;
        const loadedSession = await this.props.sessionStore.loadByIri(Session.idToIri(this.props.match.params.id));
        if(loadedSession.status === SessionStatus.STARTED) {
            this.joinedAfterStarting = true;
        }
        this.session = loadedSession;

    }



    render() {
        if(!this.session || !this.session.quiz) {
            return <Loader active/>
        }

        if(this.joinedAfterStarting) {
            return <Header>This session is already in progress!</Header>
        }

        return <Container>
            <Header size="large" textAlign="center">{this.session.quiz.name}</Header>

            <GroupPlaying session={this.session} />
        </Container>;

    }
}