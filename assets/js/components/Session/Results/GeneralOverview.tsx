import * as React from "react";
import {observer} from "mobx-react";
import Session from "../../../models/Session";
import Question from "../../../models/Question";
import QuestionOverview from "./QuestionOverview";
import {Grid, Statistic, Card} from "semantic-ui-react";
import {computed} from "mobx";

interface propTypes {
    session: Session
}

@observer
export default class GeneralOverview extends React.Component<propTypes, any> {

    /**
     * Get a list with each player (currently only iri)
     * @returns {string[]}
     */
    @computed get players() {
        const playerSet = new Set<string>();
        this.props.session.activities.forEach(activity => playerSet.add(activity.user));
        return Array.from(playerSet);
    }

    @computed get answers() {
        return this.props.session.activities.filter(activity => activity.event === 'QUESTION_ANSWER');
    }

    @computed get dodges() {
        return this.props.session.activities.filter(activity => activity.event === 'QUESTION_DODGE');
    }

    render() {
        const session = this.props.session;
        const quiz = session.quiz;
        return <div>


            <Card fluid>
                <Card.Content>
                    <Card.Header>{quiz.name}</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Statistic.Group widths={3}>
                        <Statistic>
                            <Statistic.Value>{this.players.length}</Statistic.Value>
                            <Statistic.Label>Players</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{this.answers.length}</Statistic.Value>
                            <Statistic.Label>Answers</Statistic.Label>
                        </Statistic>
                        <Statistic>
                            <Statistic.Value>{this.dodges.length}</Statistic.Value>
                            <Statistic.Label>Dodges</Statistic.Label>
                        </Statistic>
                    </Statistic.Group>
                </Card.Content>
            </Card>


            {
                quiz.questions.map((question: Question) =>
                    <QuestionOverview key={question.id}
                        activities={session.activities.filter(activity => activity.question === question)}
                        question={question}/>
                )
            }
        </div>
    }
}