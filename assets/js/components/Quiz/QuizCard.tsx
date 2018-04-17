import * as React from "react";
import {inject, observer} from "mobx-react";
import {Button, Card, Grid, Statistic, Dropdown, Popup, Icon} from "semantic-ui-react";
import Quiz from "../../models/Quiz";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import route from "../../util/route";
import routes from "../../routes";
import {observable} from "mobx";
import QuizStore from "../../stores/QuizStore";
import SessionStore from "../../stores/SessionStore";
import UiStore from "../../stores/UiStore";
import Notification, {Type} from "../../models/Notification";
import {SessionType} from "../../models/Session";

interface propTypes {
    quiz: Quiz,
    quizStore?: QuizStore,
    sessionStore?: SessionStore,
    uiStore?: UiStore
}

@inject("quizStore", "sessionStore", "uiStore") @observer
class QuizCard extends React.Component<propTypes & RouteComponentProps<{}>, any> {

    @observable deleting: boolean = false;
    @observable creatingSession: boolean = false;

    deleteQuiz = () => {
        this.deleting = true;
        this.props.quizStore.delete(this.props.quiz).catch(error => {}).then(response => {
            this.deleting = false;
        });
    };

    createSession = async (type: string) => {
        this.creatingSession = true;
        try {
            const session = await this.props.sessionStore.createSessionForQuiz(this.props.quiz, type);
            this.creatingSession = false;
            if(session.type === SessionType.GROUP) {
                this.props.history.push(route(routes.session.host, {id: session.id}));
                this.props.uiStore.addNotification(new Notification("The quiz session has started!"));
            } else {
                this.props.history.push(route(routes.session.share, {id: session.id}));
                this.props.uiStore.addNotification(new Notification("The session has been created!"));
            }

        } catch(err) {
            console.error(err);
            this.creatingSession = false;
            this.props.uiStore.addNotification(new Notification("Something went wrong while starting the session, try again later.", Type.NEGATIVE))
        }
    };

    render() {
        const quiz = this.props.quiz;

        return <Card raised>
            <Card.Content>
                <Card.Header>
                    {quiz.name}
                </Card.Header>
                <Card.Description>
                    <Grid columns="equal" textAlign="center">
                        <Grid.Column>
                            <Statistic>
                                <Statistic.Value>{quiz.questions.length}</Statistic.Value>
                                <Statistic.Label>Questions</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                        <Grid.Column>
                            <Statistic>
                                <Statistic.Value>{quiz.sessions.length}</Statistic.Value>
                                <Statistic.Label>Sessions</Statistic.Label>
                            </Statistic>
                        </Grid.Column>
                    </Grid>
                </Card.Description>
            </Card.Content>
            <Card.Content>
                <Grid textAlign="center" columns="equal">
                    <Grid.Column>
                        <Popup flowing on='click' position='bottom center' trigger={<Button circular icon="play" positive
                                                   loading={this.creatingSession} disabled={this.creatingSession}/>}>
                            <Button icon="users" content="Group" onClick={() => this.createSession(SessionType.GROUP)} labelPosition="left"/>
                            <Button icon="user" content="Individual" onClick={() => this.createSession(SessionType.INDIVIDUAL)} labelPosition="left"/>
                        </Popup>
                        </Grid.Column>
                    <Grid.Column><Link to={route(routes.session.listForQuiz, {id: quiz.id})}><Button circular icon="unordered list" color="blue" /></Link></Grid.Column>
                    <Grid.Column><Link to={route(routes.quiz.edit, {id: quiz.id})} ><Button circular icon="pencil" color="yellow" /></Link></Grid.Column>
                    <Grid.Column><Button circular icon="trash" negative loading={this.deleting} disabled={this.deleting} onClick={this.deleteQuiz} /></Grid.Column>
                </Grid>
            </Card.Content>
        </Card>
    }
}

export default withRouter(QuizCard);