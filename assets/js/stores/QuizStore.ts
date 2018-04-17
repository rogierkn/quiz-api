import {createModelSchema, identifier, list, primitive, reference} from "serializr";
import Quiz from "../models/Quiz";
import RootStore from "./RootStore";
import Question from "../models/Question";
import {QuizApi, UserApi} from "../util/api";
import Session from "../models/Session";
import EntityStore from "./EntityStore";
import User from "../models/User";


export default class QuizStore extends EntityStore<Quiz> {

    constructor(rootStore: RootStore) {
        super(rootStore, Quiz);


        // The model schema for the Quiz enitity
        createModelSchema(Quiz, {
            "@context": primitive(),
            "@id": identifier((iri, object) => this.entities.set(iri, object)),
            "@type": primitive(),
            id: primitive(),
            name: primitive(),
            questions: list(reference(Question, async (iri, callback) => callback(null, await this.rootStore.questionStore.get(iri)))),
            sessions: list(reference(Session, async (iri, callback) => callback(null, await this.rootStore.sessionStore.get(iri)))),
        }, this.factory);

    }

    newInstance():Quiz {
        return new Quiz
    };

    async createQuiz(): Promise<Quiz> {
        const response = await QuizApi.createQuiz({name: "New Quiz"});
        return this.jsonToModel(response.data as object);
    }


    loadForUser = async (user: User): Promise<Quiz[]> => {
        const response = await UserApi.loadQuizzes(user);

        return this.jsonToModel(response.data["hydra:member"]);
    }
}
