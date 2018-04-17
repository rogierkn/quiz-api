import * as React from "react";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {Button, Icon} from "semantic-ui-react";
import Quiz from "../../models/Quiz";
import QuestionStore from "../../stores/QuestionStore";
import AnswerStore from "../../stores/AnswerStore";
import Question from "../../models/Question";

interface propTypes {
    question: Question,
    answerStore?: AnswerStore,
}

@inject("answerStore") @observer
class CreateButton extends React.Component<propTypes, any> {
    @observable requestLoading: boolean = false;

    createAnswerClick = () => {
        this.requestLoading = true;
        this.props.answerStore.createAnswerForQuestion(this.props.question).then(() => {
            this.requestLoading = false;
        });
    };

    render() {
        return <Button primary onClick={this.createAnswerClick} loading={this.requestLoading}
                       disabled={this.requestLoading}>
            Add answer
        </Button>
    }
}


export default CreateButton;