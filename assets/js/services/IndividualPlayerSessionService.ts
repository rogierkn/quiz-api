import Question from "../models/Question";
import Session, {SessionStatus} from "../models/Session";
import {computed, observable} from "mobx";
import RootStore from "../stores/RootStore";
import Notification, {Type} from "../models/Notification";
import PlayerSessionService from "../interfaces/PlayerSessionService";

export default class IndividualPlayerSessionService implements PlayerSessionService {

    rootStore: RootStore;

    // Question data
    @observable totalQuestions: number = undefined;
    @observable currentQuestionIndex: number = undefined;

    @observable session: Session; // The session that is being played

    @observable selectedAnswerIri: string = null;  // Defaults to null which means a timeout - observed in currentQuestion view
    baseDecisionMadeDate: Date;
    decisionMadeDate: Date;

    @observable submitActivityRequestBusy = false;

    constructor(session: Session, rootStore: RootStore) {
        this.session = session;
        this.rootStore = rootStore;

        this.init();
    }

    private init() {
        this.totalQuestions = this.session.quiz.questions.length;
        if (this.totalQuestions === 0) {
            throw "Cannot start a session when it has no questions";
        }
        this.currentQuestionIndex = 0;
    }

    @computed get currentQuestion(): Question {
        return this.session.quiz.questions[this.currentQuestionIndex];
    }

    @computed get isLastQuestion(): boolean {
        return this.currentQuestionIndex === (this.totalQuestions - 1)
    }


    nextQuestion = async () => {

        // If already finished just return
        if (this.session.status === SessionStatus.FINISHED) {
            return;
        }

        // There is at least one unfinished/unsent question
        try {
            await this.submitActivity();
            // We just submitted last question answers?
            if (this.isLastQuestion) {
                await this.finishSession();
            } else {
                // Go to next question
                this.baseDecisionMadeDate = new Date;
                this.decisionMadeDate = null;
                this.currentQuestionIndex++;
            }
        } catch (err) {
            console.error(err);
        }
    };

    finishSession = async () => {
        this.session.status = SessionStatus.FINISHED;
    };

    submitActivity = async () => {

        this.submitActivityRequestBusy = true;
        try {
            const secondsForDecisionMaking = this.decisionMadeDate ? ((this.decisionMadeDate.getTime() - this.baseDecisionMadeDate.getTime()) / 1000) : null;
            await this.rootStore.activityStore.createActivityForSession(this.session, this.currentQuestion.iri, this.selectedAnswerIri, secondsForDecisionMaking);
            if (this.selectedAnswerIri === null) {
                this.rootStore.uiStore.addNotification(new Notification("You dodged this question!", Type.NEGATIVE));
            }
        } catch (err) {

        }


        this.selectedAnswerIri = null; // Reset to null for next question (if available)
        this.submitActivityRequestBusy = false;
    };

    startQuiz = async () => {
        this.baseDecisionMadeDate = new Date;
        this.decisionMadeDate = null;
        this.session.status = SessionStatus.STARTED;
    };

    selectAnswer(iri: string): void {
        this.decisionMadeDate = new Date;
        this.selectedAnswerIri = iri;
    }

    skipQuestion = (): void => {
        this.selectAnswer(null);
        this.nextQuestion();
    }
}