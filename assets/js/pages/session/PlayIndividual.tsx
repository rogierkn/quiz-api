import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import SessionStore from "../../stores/SessionStore";
import Session, {SessionStatus} from "../../models/Session";
import {Header, Container, Loader} from "semantic-ui-react";
import IndividualPlaying from "../../components/Session/IndividualPlaying";
import UiStore from "../../stores/UiStore";

interface propTypes {
    match: { params: { id: string } },
    sessionStore?: SessionStore,
    uiStore?: UiStore
}


@inject("sessionStore", "uiStore") @observer
export default class PlayIndividual extends React.Component<propTypes, any> {

    @observable session: Session;
    @observable joinedAfterStarting = false;


    async componentDidMount() {
        const loadedSession = await this.props.sessionStore.loadByIri(Session.idToIri(this.props.match.params.id));
        if(loadedSession.status === SessionStatus.STARTED) {
            this.joinedAfterStarting = true;
        }
        this.session = loadedSession;
        this.props.uiStore.isPlayingQuiz = true;
    }


    render() {
        if(!this.session || !this.session.quiz) {
            return <Loader active/>;
        }

        if(this.joinedAfterStarting) {
            return <Header textAlign="center">You cannot play this quiz anymore because it has been closed.</Header>
        }

        return <Container>
            <Header size="large" textAlign="center">{this.session.quiz.name}</Header>

            <IndividualPlaying session={this.session} />
        </Container>;

    }
}