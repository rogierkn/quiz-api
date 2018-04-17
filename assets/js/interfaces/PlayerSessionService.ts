import {CurrentQuestion} from "./CurrentQuestion";

export default interface PlayerSessionService {


    selectAnswer(iri: string): void;
    readonly selectedAnswerIri: string;
    readonly currentQuestion: CurrentQuestion


}