import Question from "../models/Question";
import Session, {SessionStatus} from "../models/Session";
import {action, computed, observable, ObservableMap} from "mobx";
import {Connection, Session as SocketSession} from "autobahn";
import {serialize} from "serializr";
import RootStore from "../stores/RootStore";
import Answer from "../models/Answer";
import {CurrentAnswer as CurrentAnswer, CurrentQuestion} from "../interfaces/CurrentQuestion";
import Notification, {Type} from "../models/Notification";

export default class GroupHostSessionService {

    socketSession: SocketSession;
    rootStore: RootStore;

    @observable session: Session;

    // Question data
    @observable totalQuestions: number = undefined;
    @observable currentQuestionIndex: number = undefined;

    // Visual quiz data
    @observable playerCount: number = 0;
    @observable currentAnswerStats: ObservableMap<number> = observable.map(); // Start with empty map
    @computed get totalAnswersGivenForCurrentQuestion(): number {
        return this.currentAnswerStats.values().reduce((count: number, answer: number) => count += answer, 0)
    }


    @computed get currentQuestion(): Question {
        return this.session.quiz.questions[this.currentQuestionIndex];
    }
    @computed get isLastQuestion() : boolean {
        return this.currentQuestionIndex === (this.totalQuestions - 1)
    }

    /**
     * @returns {CurrentQuestion}
     */
    @computed get currentQuestionInPlayerFormat(): CurrentQuestion {
        return {
            iri: this.currentQuestion.iri,
            text: this.currentQuestion.text,
            answers: this.currentQuestion.answers.map((answer: Answer) => ({iri: answer.iri, text: answer.text})),
            displayType: this.currentQuestion.displayType
        };
    }

    constructor(session: Session, rootStore: RootStore) {
        this.session = session;
        this.rootStore = rootStore;


        this.init();
    }

    private init() {
        let connection = new Connection({url: 'ws://' + window.location.hostname+ ':7070', realm: `session-${this.session.uuid}`});

        connection.onopen = (socketSession: SocketSession) => {
            this.socketSession = socketSession;
            socketSession.subscribe('wamp.metaevent.session.on_join', (args: any, kwargs: any) => this.playerCount++);
            socketSession.subscribe('wamp.metaevent.session.on_leave', (args: any, kwargs: any) => this.playerCount--);

            // Necessary if host refreshes page to get current player count
            socketSession.publish('session.realm_count_request');
            socketSession.subscribe('session.realm_count_response', () => this.playerCount++);

            socketSession.subscribe('quiz.session.current_question.answer_select', this.answerSelectedByPlayer);
        };

        connection.open();


        this.totalQuestions = this.session.quiz.questions.length;
        if (this.totalQuestions === 0) {
            throw "Cannot start a session when it has no questions";
        }
        this.currentQuestionIndex = 0;
        this.initSelectedAnswers();
    }

    /**
     * Update the current answer stats for the question
     * If the player has previously selected an answer, "deselect" it and add to new one. If not, only add to new one.
     * @param args
     * @param {string} newlySelectedAnswer
     * @param {string | null} previousSelectedAnswer
     */
    @action answerSelectedByPlayer = (args: any, {newlySelectedAnswer, previousSelectedAnswer}: { newlySelectedAnswer: string, previousSelectedAnswer: string | null }) => {
        // If previously answered, un-"select" it
        if (previousSelectedAnswer !== null && this.currentAnswerStats.has(previousSelectedAnswer)) {
            this.currentAnswerStats.set(
                previousSelectedAnswer,
                this.currentAnswerStats.get(previousSelectedAnswer) - 1
            );
        }
        // Update selected answer by 1
        this.currentAnswerStats.set(
            newlySelectedAnswer,
            this.currentAnswerStats.get(newlySelectedAnswer) + 1)
        ;
    };

    /**
     * Mark the session as started and notify all players that it has started
     * @returns {Promise<void>}
     */
    startSession = async () => {
        if (this.session.status !== SessionStatus.OPEN) return;
        this.session.status = SessionStatus.STARTED; // Lock the session for new players
        const response = await this.rootStore.sessionStore.save(this.session);

        // Session started; initialise default values
        if (response.status === 200) {
            this.socketSession.publish('quiz.session', [], {status: this.session.status});
        } else {
            console.error(response);
            throw "Error while starting session [saving event]";
        }

        this.initSelectedAnswers();
        this.sendCurrentQuestion()


    };

    /**
     * Send the current question to all players so they can answers
     */
    sendCurrentQuestion = () => {
        this.socketSession.publish('quiz.session.set_current_question', [], this.currentQuestionInPlayerFormat)
    };

    /**
     * Finish the session and send that to the players
     * @returns {Promise<void>}
     */
    finishSession = async () => {
        this.session.status = SessionStatus.FINISHED;
        const response = await this.rootStore.sessionStore.save(this.session);
        if (response.status === 200) {
            this.socketSession.publish('quiz.session', [], serialize(this.session));
            this.rootStore.uiStore.addNotification(new Notification('The quiz has finished!', Type.POSITIVE))
        } else {
            console.error(response);
            this.rootStore.uiStore.addNotification(new Notification('Unable to finish quiz...', Type.NEGATIVE));
            this.session.status = SessionStatus.STARTED;
            throw "Unable to finish session"
        }

    };

    /**
     * Request from all players to submit their (selected) answers
     */
    requestActivitySubmit = () => {
        this.socketSession.publish('quiz.session.current_question.submit');
    };

    /**
     * Select the next question and notify all players of this
     * @returns {Promise<void>}
     */
    @action
    nextQuestion = async () => {

        // If already finished just return
        if (this.session.status === SessionStatus.FINISHED) {
            return;
        }

        // There is at least one unfinished/unsent question
        this.requestActivitySubmit();

        // We just submitted last question answers?
        if (this.isLastQuestion) {
            setTimeout(this.finishSession, 1000); // Wait 1 second with finishing to allow all player clients to submit their answers in time
        } else {
            // Go to next question
            this.currentQuestionIndex++;
            this.initSelectedAnswers(); // Reset the map of the currentAnswerStats
            this.sendCurrentQuestion();
        }
    };

    /**
     * For the current question initialise the currentAnswerStats (the amount of selected by players for each answer)
     */
    initSelectedAnswers = () => {
        this.currentAnswerStats = this.currentQuestion.answers.reduce((currentAnswers: ObservableMap<number>, answer: CurrentAnswer) => {
            return currentAnswers.set(answer.iri, 0);
        }, observable.map());
    };


}