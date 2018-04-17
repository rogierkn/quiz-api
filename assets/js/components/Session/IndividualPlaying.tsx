import * as React from "react";
import {inject, observer} from "mobx-react";
import Session, {SessionStatus} from "../../models/Session";
import {observable} from "mobx";
import SessionStore from "../../stores/SessionStore";
import Lobby from "./Player/Individual/Lobby";
import CurrentQuestion from "./Player/CurrentQuestion";
import IndividualPlayerSessionService from "../../services/IndividualPlayerSessionService";
import {Button, Card, Grid, Header, Segment} from "semantic-ui-react";
import QuestionControls from "./Player/Individual/QuestionControls";
import AuthStore from "../../stores/AuthStore";

interface propTypes {
    session: Session,
    sessionStore?: SessionStore,
    authStore?: AuthStore
}

@inject('sessionStore', 'authStore') @observer
export default class IndividualPlaying extends React.Component<propTypes, any> {

    @observable sessionService: IndividualPlayerSessionService;

    constructor(props: propTypes) {
        super(props);
        this.sessionService = new IndividualPlayerSessionService(this.props.session, this.props.sessionStore.rootStore);
    }

    render() {
        return <div>
            {
                this.props.session.status === SessionStatus.OPEN &&
                <Lobby sessionService={this.sessionService}/>
            }

            {
                this.props.session.status === SessionStatus.STARTED &&
                <Segment padded="very">
                    <Grid>
                        <Grid.Row columns={1}>
                            <Grid.Column>
                                <CurrentQuestion sessionService={this.sessionService}/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign="center" >
                                <QuestionControls sessionService={this.sessionService}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>

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
                                    onClick={() => this.props.authStore.logout()}>Leave</Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            }
        </div>;
    }
}