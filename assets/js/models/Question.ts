import {observable} from "mobx";
import Quiz from "./Quiz";
import Answer from "./Answer";
import Entity from "../interfaces/Entity";
import {CurrentQuestion} from "../interfaces/CurrentQuestion";

export default class Question extends Entity implements CurrentQuestion {
    static iri = "/api/questions";


    @observable text: string;
    @observable type: string;
    @observable displayType: string;
    @observable answers: Array<Answer> = [];
    quiz: Quiz;

    addAnswer = (answer: Answer) => this.answers.push(answer);
    deleteAnswer = (answer: Answer) => this.answers.splice(this.answers.findIndex(questionAnswer => answer === questionAnswer), 1);

}



export const DisplayType = {
    DISPLAY_BUTTON: 'DISPLAY_BUTTON',
    DISPLAY_TILE: 'DISPLAY_TILE'
};