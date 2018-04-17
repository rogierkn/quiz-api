import * as React from "react";
import {observer} from "mobx-react";
import {Grid, Header} from "semantic-ui-react";
import Answer from "../../../models/Answer";
import AnswerButton from "./AnswerButton";
import PlayerSessionService from "../../../interfaces/PlayerSessionService";
import {DisplayType} from "../../../models/Question";

interface propTypes {
    sessionService: PlayerSessionService,
}

@observer
export default class
CurrentQuestion extends React.Component<propTypes, any> {


    selectAnswer = (iri: string) => {
        this.props.sessionService.selectAnswer(iri);
    };

    render()
    {
        const question = this.props.sessionService.currentQuestion;
        if (question === undefined) {
            return <div>...</div>;
        }

        let answers = question.answers.map((answer: Answer, index: number) =>
            <AnswerButton key={answer.iri}
                          toggled={this.props.sessionService.selectedAnswerIri === answer.iri}
                          onClick={() => this.selectAnswer(answer.iri)} answer={answer}
                          displayType={question.displayType}
                          indexInList={index}/>);
        let AnswerWrapper = undefined;

        if (question.displayType === DisplayType.DISPLAY_BUTTON) {
            AnswerWrapper = <div>{answers}</div>;
        } else if (question.displayType === DisplayType.DISPLAY_TILE) {
            AnswerWrapper = <Grid>
                {answers}
            </Grid>
        }

        return <div>

            <Header>{question.text}</Header>
            {
                AnswerWrapper
            }




        </div>;
    }
}