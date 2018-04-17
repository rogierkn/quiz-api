import * as React from "react";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {Button, Icon} from "semantic-ui-react";
import Quiz from "../../models/Quiz";
import QuestionStore from "../../stores/QuestionStore";

interface propTypes {
    quiz: Quiz,
    questionStore?: QuestionStore,
    disabled: boolean,
}

@inject("questionStore") @observer
class CreateButton extends React.Component<propTypes, any> {
    @observable requestLoading: boolean = false;

    createQuestionClick = () => {
        this.requestLoading = true;
        this.props.questionStore.createQuestionForQuiz(this.props.quiz).then(() => {
            this.requestLoading = false;
        });
    };

    render() {
        return <Button primary onClick={this.createQuestionClick} loading={this.requestLoading}
                       disabled={this.props.disabled || this.requestLoading}>
            Add question
        </Button>
    }
}


export default CreateButton;