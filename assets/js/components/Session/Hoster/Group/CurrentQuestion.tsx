import * as React from "react";
import {observer} from "mobx-react";
import {Button, Divider, Grid, Header, Loader, Segment, Statistic} from "semantic-ui-react";
import AnswerInformation from "./AnswerInformation";
import GroupHostSessionService from "../../../../services/GroupHostSessionService";
import Answer from "../../../../models/Answer";

interface propTypes {
    sessionService: GroupHostSessionService,
}

@observer
export default class CurrentQuestion extends React.Component<propTypes, any> {

    render() {
        const question = this.props.sessionService.currentQuestion;
        if (question === undefined) {
            return <Loader active/>;
        }
        return <Segment padded="very">
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Header size="huge">{question.text}</Header>
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="center">
                        <Statistic.Group widths={2}>
                        <Statistic>
                            <Statistic.Value>{this.props.sessionService.totalAnswersGivenForCurrentQuestion}</Statistic.Value>
                            <Statistic.Label>Answers</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{this.props.sessionService.playerCount}</Statistic.Value>
                            <Statistic.Label>Players</Statistic.Label>
                        </Statistic>
                        </Statistic.Group>
                    </Grid.Column>

                </Grid.Row>
                <Divider hidden section/>
                <Grid.Row>
                    <Grid.Column width={16}>
                        <Grid>
                            {
                                question.answers.map((answer: Answer, indexInList: number) =>
                                    <AnswerInformation
                                        indexInList={indexInList} key={answer.iri} answer={answer}
                                        totalAnswerGivenForThisAnswer={this.props.sessionService.currentAnswerStats.get(answer.iri)}
                                        totalAnswersGiven={this.props.sessionService.totalAnswersGivenForCurrentQuestion}/>
                                )
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Divider hidden section/>
                <Divider hidden section/>
                <Grid.Row>
                    <Grid.Column width={16} textAlign="center">
                        <Button size="huge" primary onClick={this.props.sessionService.nextQuestion}>
                            {this.props.sessionService.isLastQuestion ? "Finish quiz" : "Next Question"}
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </Segment>;
    }
}


