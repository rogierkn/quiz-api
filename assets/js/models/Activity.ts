import {observable} from "mobx";
import Question from "./Question";
import Entity from "../interfaces/Entity";
import Session from "./Session";
import Answer from "./Answer";

export default class Activity extends Entity {
    static iri = "/api/activities";

    @observable session: Session;
    @observable question: Question;
    @observable user: string; // todo impl user model
    @observable answer: Answer | null;
    @observable secondsForDecision: number|null;
    @observable event: string;
    @observable correct: boolean;
    @observable createdAt: string;
}

