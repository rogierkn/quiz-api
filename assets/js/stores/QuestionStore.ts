import {createModelSchema, identifier, list, primitive, reference} from "serializr";
import Question from "../models/Question";
import RootStore from "./RootStore";
import Quiz from "../models/Quiz";
import {QuestionApi} from "../util/api";
import EntityStore from "./EntityStore";


export default class QuestionStore extends EntityStore<Question> {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        super(rootStore, Question);

        createModelSchema(Question, {
            "@context": primitive(),
            "@id": identifier((iri, object) => this.entities.set(iri, object)),
            "@type": primitive(),
            id: primitive(),
            text: primitive(),
            type: primitive(),
            displayType: primitive(),
            answers: list(reference(Quiz, async (iri, callback) => callback(null, await this.rootStore.answerStore.get(iri)))),
            quiz: reference(Quiz, (iri, callback) => callback(null, this.rootStore.quizStore.entities.get(iri)))
        }, this.factory);
    }

    newInstance(): Question {
        return new Question
    };


    async createQuestionForQuiz(quiz: Quiz) {
        const response = await QuestionApi.createQuestion({
            type: "SINGLE_ANSWER",
            quiz: quiz.iri
        });
        const question = this.jsonToModel(response.data as object);
        quiz.addQuestion(question);
        return question;
    }


    async delete(question: Question): Promise<any> {
        const response = await super.delete(question);
        if(response.status === 204) {
            question.quiz.deleteQuestion(question);
        }
        return response;
    }
}