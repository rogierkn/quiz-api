import {observable} from "mobx";
import Question from "./Question";
import Entity from "../interfaces/Entity";

export default class Answer extends Entity {
    static iri = "/api/answers";

    @observable text: string;
    @observable correct: boolean;
    question: Question;
}

