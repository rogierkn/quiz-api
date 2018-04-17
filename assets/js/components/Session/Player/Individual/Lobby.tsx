import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import Session, {SessionStatus} from "../../../../models/Session";
import SessionStore from "../../../../stores/SessionStore";
import {Button, Container, Header} from "semantic-ui-react";
import {Session as SocketSession} from "autobahn";
import {serialize} from "serializr";
import IndividualPlayerSessionService from "../../../../services/IndividualPlayerSessionService";

interface propTypes {
    sessionService: IndividualPlayerSessionService,
}

@observer
export default class Lobby extends React.Component<propTypes, any> {


    render() {
        return <Container textAlign="center">
            <Header size="medium">Start the quiz whenever you want</Header>
            <Button primary size="huge" onClick={this.props.sessionService.startQuiz}>Start quiz</Button>
        </Container>;
    }
}