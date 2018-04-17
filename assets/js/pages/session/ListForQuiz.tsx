import * as React from "react";
import {observable, computed, action} from "mobx";
import {inject, observer} from "mobx-react";
import Session from "../../models/Session";
import {SessionApi} from "../../util/api";
import Quiz from "../../models/Quiz";
import SessionStore from "../../stores/SessionStore";
import QuizStore from "../../stores/QuizStore";
import SessionList from "../../components/Session/SessionList";
import {Loader} from "semantic-ui-react";
import {RouteComponentProps, RouteProps, RouterProps, withRouter} from "react-router";

interface propTypes {
    match: { params: { id: string } },
    quizStore?: QuizStore,
    sessionStore?: SessionStore
}

@inject('quizStore', 'sessionStore') @observer
class ListForQuiz extends React.Component<propTypes & RouteComponentProps<any>, any> {

    @observable sessions: Session[];
    @observable quiz: Quiz;


    async componentDidMount() {
        this.quiz = await this.props.quizStore.get(Quiz.idToIri(this.props.match.params.id));
        this.sessions = await this.props.sessionStore.getSessionsForQuiz(this.quiz);
    }


    render() {

        if(!this.quiz || !this.sessions) {
            return <Loader active />
        }

        return <SessionList quiz={this.quiz} sessions={this.sessions} history={this.props.history} />
    }
}

export default withRouter(ListForQuiz);