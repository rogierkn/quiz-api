import * as React from "react";
import {inject, observer} from "mobx-react";
import Session, {SessionStatus} from "../../models/Session";
import {Connection, Session as SocketSession} from "autobahn";
import {observable} from "mobx";
import SessionStore from "../../stores/SessionStore";
import Lobby from "./Player/Group/Lobby";
import CurrentQuestion from "./Player/CurrentQuestion";
import PlayerSessionService from "../../interfaces/PlayerSessionService";
import GroupPlayerSessionService from "../../services/GroupPlayerSessionService";
import route from "../../util/route";
import routes from "../../routes";
import {Card, Header, Button} from "semantic-ui-react";
import AuthStore from "../../stores/AuthStore";

interface propTypes {
    session: Session,
    sessionStore?: SessionStore,
    authStore?: AuthStore
}

@inject('sessionStore', 'authStore') @observer
export default class GroupPlaying extends React.Component<propTypes, any> {

    @observable sessionService: PlayerSessionService;

    componentDidMount() {
        this.sessionService = new GroupPlayerSessionService(this.props.session, this.props.sessionStore.rootStore);
    }

    render() {
        return <div>
            {
                this.props.session.status === SessionStatus.OPEN &&
                <Lobby sessionService={this.sessionService}/>
            }

            {
                this.props.session.status === SessionStatus.STARTED &&
                <CurrentQuestion sessionService={this.sessionService}/>
            }

            {
                this.props.session.status === SessionStatus.FINISHED &&
                <Card centered raised>
                    <Card.Content textAlign="center">
                        <Header size="huge">The quiz has finished</Header>

                        <p>Thank you for participating</p>
                        <p>You can now leave the application</p>

                    </Card.Content>

                    <Card.Content extra textAlign="center">
                        <Button.Group fluid>
                            <Button primary
                                    onClick={() => this.props.authStore.logout()}>Logout</Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            }
        </div>;
    }
}

