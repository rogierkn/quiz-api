import Session from "../models/Session";
import {observable} from "mobx";
import {Connection, Session as SocketSession} from "autobahn";
import RootStore from "../stores/RootStore";
import {CurrentQuestion} from "../interfaces/CurrentQuestion";
import Notification, {Type} from "../models/Notification";
import PlayerSessionService from "../interfaces/PlayerSessionService";

export default class GroupPlayerSessionService implements PlayerSessionService {

    socketSession: SocketSession;
    rootStore: RootStore;

    @observable session: Session; // The session that is being played
    @observable currentQuestion: CurrentQuestion; // The current question the session is at

    @observable selectedAnswerIri: string = null;  // Defaults to null which means a timeout - observed in currentQuestion view
    baseDecisionMadeDate: Date;
    decisionMadeDate: Date;

    constructor(session: Session, rootStore: RootStore) {
        this.session = session;
        this.rootStore = rootStore;


        this.init();
    }

    private init() {
        let connection = new Connection({
            url: 'ws://' + window.location.hostname + ':7070',
            realm: `session-${this.session.uuid}`
        });


        connection.onopen = (socketSession: SocketSession) => {
            this.socketSession = socketSession;

            socketSession.subscribe('quiz.session', (args: any, sessionUpdateData: any) => this.rootStore.sessionStore.update(this.session, sessionUpdateData));
            socketSession.subscribe('quiz.session.set_current_question', this.nextQuestion);
            socketSession.subscribe('quiz.session.current_question.submit', this.submitActivity);
            socketSession.subscribe('session.realm_count_request', () => socketSession.publish('session.realm_count_response'))
        };

        connection.onclose = (reason: string, details: any): boolean => {
            // todo maybe redirect to authenticate or dashboard..?
            return true;
        };

        connection.open();

    }

    nextQuestion = (args: any, nextQuestion: CurrentQuestion) => {
        this.baseDecisionMadeDate = new Date;
        this.decisionMadeDate = null;

        this.currentQuestion = nextQuestion;
    };

    submitActivity = async () => {


        try {
            const secondsForDecisionMaking = this.decisionMadeDate ? ((this.decisionMadeDate.getTime() - this.baseDecisionMadeDate.getTime()) / 1000) : null;
            await this.rootStore.activityStore.createActivityForSession(this.session, this.currentQuestion.iri, this.selectedAnswerIri, secondsForDecisionMaking);

            if (this.selectedAnswerIri === null) {
                this.rootStore.uiStore.addNotification(new Notification("You dodged this question!", Type.NEGATIVE));
            }
        } catch(err) {

        }


        this.selectedAnswerIri = null; // Reset to null for next question (if available)
    };

    selectAnswer(iri: string): void {
        const previousSelectedAnswer = this.selectedAnswerIri;
        this.decisionMadeDate = new Date;
        this.selectedAnswerIri = iri;
        this.socketSession.publish('quiz.session.current_question.answer_select', [], {
            newlySelectedAnswer: this.selectedAnswerIri,
            previousSelectedAnswer
        })
    }

}