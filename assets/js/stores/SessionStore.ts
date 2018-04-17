import {createModelSchema, identifier, list, primitive, reference} from "serializr";
import RootStore from "./RootStore";
import Quiz from "../models/Quiz";
import {SessionApi} from "../util/api";
import Session from "../models/Session";
import EntityStore from "./EntityStore";
import Activity from "../models/Activity";


export default class SessionStore extends EntityStore<Session> {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        super(rootStore, Session);

        createModelSchema(Session, {
            "@context": primitive(),
            "@id": identifier((iri, object) => this.entities.set(iri, object)),
            "@type": primitive(),
            id: primitive(),
            uuid: primitive(),
            type: primitive(),
            status: primitive(),
            createdAt: primitive(),
            quiz: reference(Quiz, async (id, callback) => callback(null, await this.rootStore.quizStore.get(id))),
            activities: list(reference(Activity, async (id, callback) => callback(null, await this.rootStore.activityStore.get(id))))
        }, this.factory);
    }

    newInstance(): Session {
        return new Session();
    };

    async createSessionForQuiz(quiz: Quiz, type: string) {
        let session = new Session;
        session.quiz = quiz;
        session.type = type;
        const response = await SessionApi.createSession(session);

        session = this.jsonToModel(response.data as object);
        quiz.addSession(session);
        this.entities.set(session.iri, session);
        return session;
    }

    async getSessionsForQuiz(quiz: Quiz) {
        const response = await SessionApi.getForQuiz(quiz);
        const sessions = this.jsonToModel(response.data["hydra:member"] as object[]);
        sessions.forEach(session => quiz.addSession(session));
        return sessions;
    }
}