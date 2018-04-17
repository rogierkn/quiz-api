import * as React from "react";
import {observer} from "mobx-react";
import Quiz from "../../models/Quiz";
import QuizCard from "./QuizCard";
import {Card, Container} from "semantic-ui-react";

interface propTypes {
    quizzes: Array<Quiz>,
}

@observer
export default class QuizCardList extends React.Component<propTypes, any> {



    render() {
        return <Container>
            <Card.Group itemsPerRow={2} stackable>
                {this.props.quizzes.map((quiz: Quiz) => {
                    return <QuizCard key={quiz.iri} quiz={quiz}/>
                })}
            </Card.Group>

        </Container>;
    }
}