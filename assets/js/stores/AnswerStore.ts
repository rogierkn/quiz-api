import {createModelSchema, identifier, primitive, reference} from "serializr";
import Question from "../models/Question";
import RootStore from "./RootStore";
import {AnswerApi} from "../util/api";
import Answer from "../models/Answer";
import EntityStore from "./EntityStore";


export default class AnswerStore extends EntityStore<Answer> {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        super(rootStore, Answer);

        createModelSchema(Answer, {
            "@context": primitive(),
            "@id": identifier((iri, object) => this.entities.set(iri, object)),
            "@type": primitive(),
            id: primitive(),
            text: primitive(),
            correct: primitive(),
            question: reference(Question, async (id, callback) => {
                const question = await this.rootStore.questionStore.entities.get(id);
                callback(null, question);
            })
        }, this.factory);

    }

    newInstance(): Answer {
        return new Answer
    };

    async createAnswerForQuestion(question: Question) {
        const response = await AnswerApi.createAnswer({text: "New answer", correct: false, question: question.iri});
        const answer = this.jsonToModel(response.data as object);
        question.addAnswer(answer);
        answer.question = question;
        return answer;
    }


    async delete(answer: Answer): Promise<any> {
        const response = await super.delete(answer);
        if(response.status === 204) {
            answer.question.deleteAnswer(answer);
        }
    }
}