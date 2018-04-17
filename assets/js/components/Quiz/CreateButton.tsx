import * as React from "react";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {Button} from "semantic-ui-react";
import {RouteComponentProps, withRouter} from "react-router";
import routes from "../../routes";
import QuizStore from "../../stores/QuizStore";
import {History} from "history";

interface propTypes {
    quizStore?: QuizStore,
    history?: History
}
@inject("quizStore") @observer
class CreateButton extends React.Component<propTypes & RouteComponentProps<{}>, any> {
    @observable requestLoading: boolean = false;
    @action createQuizClick = async () => {
        this.requestLoading = true;

        try {
            const quiz = await this.props.quizStore.createQuiz();
            this.props.history.push(routes.quiz.edit.replace(":id", "" + quiz.id))
        } finally {
            this.requestLoading = false;
        }


    };

    render() {
        return <Button primary={true} onClick={this.createQuizClick} loading={this.requestLoading}
                       disabled={this.requestLoading}>Create new quiz</Button>
    }
}


export default withRouter(CreateButton);