import * as React from "react";
import {observable, ObservableMap} from "mobx";
import {inject, observer} from "mobx-react";
import QuizStore from "../../stores/QuizStore";
import QuizList from "../../components/Admin/QuizList";
import Quiz from "../../models/Quiz";
import {EntityApi} from "../../util/api";
import Pagination from "../../interfaces/Pagination";


interface propTypes {
    quizStore?: QuizStore,
}


/**
 * Because the admin view has different requirements than normal views we use no stores here, keep the entities
 */

@inject('quizStore') @observer
export default class QuizzesOverview extends React.Component<propTypes, any> {

    loadedCallback = () => {
    };

    @observable quizzes: ObservableMap<Quiz> = observable.map();
    @observable page: number = 0;
    @observable pagination: Pagination = {
        ["@id"]: undefined,
        ["hydra:first"]: undefined,
        ["hydra:last"]: undefined,
        ["hydra:next"]: undefined,
        ["hydra:previous"]: undefined,
    };

    async componentDidMount() {
        this.loadQuizzes(`${Quiz.iri}.jsonld?paginate=true&page=1`);
    }

    loadQuizzes = async (iri: string) => {
        if (iri === undefined) {
            return;
        }
        const {data} = await EntityApi.get(iri);
        this.quizzes = observable.map();
        (await this.props.quizStore.jsonToModel(data["hydra:member"])).forEach(quiz => this.quizzes.set(quiz.iri, quiz));
        this.pagination = data["hydra:view"] ? data["hydra:view"] : this.pagination;

        this.loadedCallback();
    };

    componentWillUnmount() {
        // If we leave admin view we don't want these quizzes to clutter up other views
        this.props.quizStore.entities.clear();
        // Incase request is still async loading make sure we clean up when finished
        this.loadedCallback = () => this.props.quizStore.entities = observable.map()
    }


    render() {

        return <QuizList quizzes={this.quizzes}
                         pagination={this.pagination}
                         paginate={this.loadQuizzes}
        />
    }
}