import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import Session, {SessionStatus} from "../../../../models/Session";
import SessionStore from "../../../../stores/SessionStore";
import {Button, Container, Header} from "semantic-ui-react";
import {Session as SocketSession} from "autobahn";
import {serialize} from "serializr";
import GroupPlayerSessionService from "../../../../services/GroupPlayerSessionService";
import PlayerSessionService from "../../../../interfaces/PlayerSessionService";

interface propTypes {
    sessionService: PlayerSessionService,
}

@observer
export default class Lobby extends React.Component<propTypes, any> {


    render() {
        return <Container textAlign="center">
            <Header size="huge">Waiting for host to start quiz...</Header>
            <div className="circle pulsate" style={{margin: 'auto'}}/>
        </Container>;
    }
}