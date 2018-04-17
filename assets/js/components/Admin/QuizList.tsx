import * as React from "react";
import {inject, observer} from "mobx-react";
import Quiz from "../../models/Quiz";
import {Button, Container, Grid, Table} from "semantic-ui-react";
import routes from "../../routes";
import route from "../../util/route";
import {Link} from "react-router-dom";
import PaginationInterface from "../../interfaces/Pagination";
import QuizStore from "../../stores/QuizStore";
import {observable, ObservableMap} from "mobx";

interface propTypes {
    quizzes: ObservableMap<Quiz>,
    pagination: PaginationInterface,
    paginate: (iri: string) => Promise<void>,
    quizStore?: QuizStore
}

@inject('quizStore') @observer
export default class QuizList extends React.Component<propTypes, any> {
    @observable deleting: ObservableMap<boolean> = observable.map();

    deleteQuiz = async (quiz:Quiz) => {
        this.deleting.set(quiz.iri, true);
        try {
            await this.props.quizStore.delete(quiz);
            this.props.quizzes.delete(quiz.iri);
        } catch(err) {

        } finally {
            this.deleting.delete(quiz.iri);
        }
    };

    render() {
        const quizzes = this.props.quizzes.values().sort((a: Quiz, b: Quiz) => (b.id as any) - (a.id as any));
        return <Container>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Questions</Table.HeaderCell>
                        <Table.HeaderCell>Sessions</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {quizzes.map(quiz => <Table.Row key={quiz.id}>
                        <Table.Cell>{quiz.name}</Table.Cell>
                        <Table.Cell>{quiz.questions.length}</Table.Cell>
                        <Table.Cell>{quiz.sessions.length}</Table.Cell>
                        <Table.Cell textAlign="center">
                            <Link to={route(routes.session.listForQuiz, {id: quiz.id})}>
                                <Button circular
                                        icon="unordered list"
                                        color="blue"/>
                            </Link>

                            <Button circular icon="trash" negative loading={this.deleting.has(quiz.iri)} disabled={this.deleting.has(quiz.iri)} onClick={() => this.deleteQuiz(quiz)} />
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>
            <Grid columns={2}>
                <Grid.Column floated="left">
                    <Button.Group>
                        <Button disabled={this.props.pagination["hydra:first"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:first"])}>First</Button>
                        <Button disabled={this.props.pagination["hydra:previous"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:previous"])}>Previous</Button>
                    </Button.Group>
                </Grid.Column>
                <Grid.Column floated="right" textAlign="right">
                    <Button.Group>
                        <Button disabled={this.props.pagination["hydra:next"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:next"])}>Next</Button>
                        <Button disabled={this.props.pagination["hydra:last"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:last"])}>Last</Button>
                    </Button.Group>
                </Grid.Column>
            </Grid>
        </Container>;
    }
}