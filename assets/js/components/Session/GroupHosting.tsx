import * as React from "react";
import {inject, observer} from "mobx-react";
import Session, {SessionStatus} from "../../models/Session";
import {observable} from "mobx";
import Lobby from "./Hoster/Group/Lobby";
import SessionStore from "../../stores/SessionStore";
import {Button, Card, Container, Header, Loader, Step} from "semantic-ui-react";
import CurrentQuestion from "./Hoster/Group/CurrentQuestion";
import GroupHostSessionService from "../../services/GroupHostSessionService";
import {RouteComponentProps, withRouter} from "react-router";
import route from "../../util/route";
import routes from "../../routes";

interface propTypes {
    session: Session,
    sessionStore?: SessionStore,
}

@inject('sessionStore') @observer
class GroupHosting extends React.Component<propTypes & RouteComponentProps<any>, any> {

    @observable playerCount: number = 0;

    @observable sessionService: GroupHostSessionService;


    componentDidMount() {
        this.sessionService = new GroupHostSessionService(this.props.session, this.props.sessionStore.rootStore);
    }


    render() {
        if (this.sessionService === undefined) {
            return <Loader active/>
        }
        const steps = [
            {
                key: 'Lobby',
                active: this.props.session.status === SessionStatus.OPEN,
                disabled: this.props.session.status !== SessionStatus.OPEN,
                icon: 'wait',
                title: 'Lobby',
                description: 'Waiting for others to join'
            },
            {
                key: 'Playing',
                active: this.props.session.status === SessionStatus.STARTED,
                disabled: this.props.session.status !== SessionStatus.STARTED,
                icon: 'play',
                title: 'Playing',
                description: 'Playing the quiz'
            },
            {
                key: 'Finished',
                active: this.props.session.status === SessionStatus.FINISHED,
                disabled: this.props.session.status !== SessionStatus.FINISHED,
                icon: 'checkmark',
                title: 'Quiz has finished'
            },
        ];

        return <div>
            <Header size="large" textAlign="center">{this.sessionService.session.quiz.name}</Header>
            <Container textAlign="center"><Step.Group items={steps} size="mini" /></Container>


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

                        <p>You can now go and view the results or leave the application</p>

                    </Card.Content>

                    <Card.Content extra textAlign="center">
                        <Button.Group fluid>
                            <Button color="blue"
                                    onClick={() => this.props.history.push(route(routes.session.results, {id: this.sessionService.session.id}))}>Results</Button>
                            <Button primary
                                    onClick={() => this.props.history.push(routes.general.quizzes)}>Leave</Button>
                        </Button.Group>
                    </Card.Content>
                </Card>
            }
        </div>;
    }
}

export default withRouter(GroupHosting);