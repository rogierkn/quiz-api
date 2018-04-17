import * as React from "react";
import {observer} from "mobx-react";
import Answer from "../../../models/Answer";
import Activity from "../../../models/Activity";
import Question from "../../../models/Question";
import {Card, Header} from "semantic-ui-react";
import ResultAnswerInformation from "./ResultAnswerInformation";
import {computed} from "mobx";

interface propTypes {
    question: Question,
    activities: Activity[]
}

@observer
export default class QuestionOverview extends React.Component<propTypes, any> {

    @computed get averageDecisionTime(): number {
        const nonNullSecondsArray = this.props.activities
            .map(activity => activity.secondsForDecision)
            .filter(seconds => seconds !== null);

        return nonNullSecondsArray.reduce((seconds:number, secondsForDecision: number) => seconds += secondsForDecision, 0) / nonNullSecondsArray.length;
    }

    averageDecisionTimeForAnswer(answer: Answer): number {
        const nonNullSecondsArray = this.props.activities.filter(activity => activity.answer === answer)
            .map(activity => activity.secondsForDecision)
            .filter(seconds => seconds !== null);

        return nonNullSecondsArray.reduce((seconds:number, secondsForDecision: number) => seconds += secondsForDecision, 0) / nonNullSecondsArray.length;
    }


    render() {
        const question = this.props.question;
        const activities = this.props.activities;


        return <Card fluid>
            <Card.Content>
                <Card.Header>{question.text}</Card.Header>
            </Card.Content>
            <Card.Content>
                <p>Average seconds to decision: {!isNaN(this.averageDecisionTime) ? this.averageDecisionTime : '-'}</p>
            </Card.Content>
            <Card.Content>

                {question.answers.map((answer: Answer, indexInList: number) => {
                    return <ResultAnswerInformation key={answer.id}
                                                    answer={answer} totalAnswersGiven={activities.length}
                                                    correct={answer.correct}
                                                    totalAnswerGivenForThisAnswer={activities.filter(activity => activity.answer === answer).length}
                                                    averageDecisionTime={this.averageDecisionTimeForAnswer(answer)}
                                                    indexInList={indexInList}/>
                })}
            </Card.Content>
        </Card>;
    }
}