import * as React from "react";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {Grid, Progress, SemanticCOLORS, Header} from "semantic-ui-react";
import {CurrentAnswer} from "../../../../interfaces/CurrentQuestion";
import AnswerColors from "../../../../util/AnswerColors";

interface propTypes {
    className?: string, // Used for animating Transition.Group which will apply classes to the used Grid.Row below
    answer: CurrentAnswer // Note: not actual model but mere JS object
    totalAnswersGiven: number,
    totalAnswerGivenForThisAnswer: number,
    indexInList: number,
}

@observer
export default class
AnswerInformation extends React.Component<propTypes, any> {
    render() {
        return <Grid.Row columns={2} className={this.props.className}>
            <Grid.Column>
                <Header size="medium">{this.props.answer.text}</Header>
            </Grid.Column>

            <Grid.Column>
                <Progress color={this.color}
                          percent={this.percentageSelected}>
                    {this.percentageSelected}%
                </Progress>
            </Grid.Column>
        </Grid.Row>;
    }


    /**
     * Get the color for this answer according to its index in the answer list
     * @returns {string}
     */
    @computed get color(): SemanticCOLORS {
        return AnswerColors[this.props.indexInList % AnswerColors.length] as SemanticCOLORS;
    }

    @computed get percentageSelected(): string {
        // Can't divide by 0 so return 0 (%)
        if (this.props.totalAnswersGiven === 0) {
            return "0";
        }

        return ((this.props.totalAnswerGivenForThisAnswer / this.props.totalAnswersGiven) * 100).toFixed(1);
    }
}