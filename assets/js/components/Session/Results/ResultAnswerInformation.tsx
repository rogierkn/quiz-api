import * as React from "react";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {Grid, Progress, SemanticCOLORS, Header} from "semantic-ui-react";
import {CurrentAnswer} from "../../../interfaces/CurrentQuestion";
import AnswerColors from "../../../util/AnswerColors";

interface propTypes {
    className?: string, // Used for animating Transition.Group which will apply classes to the used Grid.Row below
    answer: CurrentAnswer // Note: not actual model but mere JS object
    totalAnswersGiven: number,
    totalAnswerGivenForThisAnswer: number,
    indexInList: number,
    correct: boolean,
    averageDecisionTime: number,
}

@observer
export default class ResultAnswerInformation extends React.Component<propTypes, any> {


    render() {
        return <Grid.Row columns={2} className={this.props.className}>
            <Grid.Column>
                <Header>{this.props.answer.text}</Header>
                <p>Average seconds to decision: {!isNaN(this.props.averageDecisionTime) ? this.props.averageDecisionTime : '-' }</p>
            </Grid.Column>

            <Grid.Column>
                <Progress color={this.props.correct ? "green" : "red"}
                          percent={this.percentageSelected}>
                    {this.percentageSelected}%
                </Progress>
            </Grid.Column>
        </Grid.Row>;
    }



    @computed get percentageSelected(): string {
        // Can't divide by 0 so return 0 (%)
        if (this.props.totalAnswersGiven === 0) {
            return "0";
        }

        return ((this.props.totalAnswerGivenForThisAnswer / this.props.totalAnswersGiven) * 100).toFixed(1);
    }
}