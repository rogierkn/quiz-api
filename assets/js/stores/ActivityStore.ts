import {createModelSchema, identifier, primitive, reference} from "serializr";
import RootStore from "./RootStore";
import {ActivityApi, SessionApi} from "../util/api";
import Session from "../models/Session";
import EntityStore from "./EntityStore";
import Activity from "../models/Activity";
import Question from "../models/Question";
import Answer from "../models/Answer";


export default class ActivityStore extends EntityStore<Activity> {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        super(rootStore, Activity);

        createModelSchema(Activity, {
            "@context": primitive(),
            "@id": identifier((iri, object) => this.entities.set(iri, object)),
            "@type": primitive(),
            id: primitive(),
            session: reference(Session, async (id, callback) => callback(null, await this.rootStore.sessionStore.get(id))),
            question: reference(Question, async (id, callback) => callback(null, await this.rootStore.questionStore.get(id))),
            answer: reference(Answer, async (id, callback) => callback(null, await this.rootStore.answerStore.get(id))),
            secondsForDecision: primitive(),
            event: primitive(),
            corrct: primitive(),
            createdAt: primitive(),
        }, this.factory);
    }

    newInstance(): Activity {
        return new Activity();
    };


    async createActivityForSession(session: Session, questionIri: string, answerIri: string | null, secondsForDecision: number|null) {

        const response = await ActivityApi.createActivity({
            session: session.iri,
            question: questionIri,
            answer: answerIri,
            secondsForDecision
        });

        return response;
    }
}