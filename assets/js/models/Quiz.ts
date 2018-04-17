import {observable} from "mobx";
import Question from "./Question";
import Entity from "../interfaces/Entity";
import Session from "./Session";

export default class Quiz extends Entity {

    static iri = "/api/quizzes";



    @observable name: string = "";

    @observable questions: Array<Question> = [];
    @observable sessions: Array<Session> = [];


    addQuestion = (question: Question) => this.questions.push(question);
    deleteQuestion = (question: Question) => this.questions.splice(this.questions.findIndex(quizQuestion => question === quizQuestion), 1);

    addSession = (session: Session) => this.sessions.push(session);

}
