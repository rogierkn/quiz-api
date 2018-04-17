import * as React from "react";
import {inject, observer} from "mobx-react"
import CreateButton from "../../components/Quiz/CreateButton";
import QuizStore from "../../stores/QuizStore";
import {Divider, Header, Button, Container} from "semantic-ui-react";
import QuizCardList from "../../components/Quiz/QuizCardList";
import AuthStore from "../../stores/AuthStore";
import {observable} from "mobx";
import Quiz from "../../models/Quiz";
import routes from "../../routes";
import {RouteComponentProps, withRouter} from "react-router";


interface propTypes {
    quizStore?: QuizStore,
    authStore?: AuthStore
}

@inject("quizStore", "authStore") @observer
class Quizzes extends React.Component<propTypes & RouteComponentProps<any>, any> {


    async componentDidMount() {
        if(!this.props.authStore.user.roles.includes("ROLE_TEACHER")) {
            this.props.history.push(routes.general.dashboard);
            return;
        }
        this.props.quizStore.entities = observable.map(); // Reset list so we know it's fresh
        await this.props.quizStore.loadForUser(this.props.authStore.user);

    }


    render() {
        return <Container>

            <Header size="large">Quizzes</Header>

            <QuizCardList quizzes={this.props.quizStore.entities.values().slice()}/>
            <Divider hidden/>
            <CreateButton/>
        </Container>
    }

}

export default withRouter(Quizzes)