import * as React from "react";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {Divider, Grid, Header, Segment, Transition} from "semantic-ui-react";
import QuizEditForm from "../../components/Quiz/EditForm";
import QuizStore from "../../stores/QuizStore";
import Question from "../../models/Question";
import QuestionEditForm from "../../components/Question/EditForm";
import Quiz from "../../models/Quiz";
import CreateButton from "../../components/Question/CreateButton";
import {AxiosPromise} from "axios";
import RootStore from "../../stores/RootStore";


interface propsType {
    quizStore: QuizStore,
    match: { params: { id: string } }
}

@inject((stores: RootStore) => ({
    quizStore: stores.quizStore
})) @observer
export default class Edit extends React.Component<propsType, any> {

    @observable loadingData = false;
    @observable sendingData = false;


    @computed get quiz(): Quiz {
        return this.props.quizStore.entities.get(Quiz.idToIri(this.props.match.params.id)) || new Quiz(); // Dummy Quiz when it's still loading so UI can show a "skeleton"
    }

    @computed get id() {
        return this.props.match.params.id;
    }

    componentDidMount() {
        this.loadingData = true;
        this.props.quizStore.loadByIri(Quiz.idToIri(this.id)).then(() => this.loadingData = false);
    }

    render() {
        const quiz = this.quiz;


        return <Grid>

                <Grid.Row>
                    <Grid.Column width={16}>
                        <Header size="large">Quiz properties</Header>
                        <Segment loading={this.loadingData} padded="very">
                            <QuizEditForm quiz={quiz} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>

            <Grid.Row>
                <Grid.Column>
                    <Header size="large">Questions</Header>

                    <Transition.Group
                        as={Grid}
                        duration={500}>
                        {quiz.questions.map((question: Question) => <Grid.Row key={question.id} columns={1}>
                            <Grid.Column>
                                <QuestionEditForm question={question}/>
                            </Grid.Column>
                        </Grid.Row>)}
                    </Transition.Group>


                    <Divider hidden/>
                    <CreateButton disabled={this.loadingData} quiz={quiz} />
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    }
}