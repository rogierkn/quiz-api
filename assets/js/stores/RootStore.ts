import QuizStore from "./QuizStore";
import Quiz from "../models/Quiz";
import QuestionStore, {default as Questionstore} from "./QuestionStore";
import DashboardStore from "./DashboardStore";
import AnswerStore from "./AnswerStore";
import SessionStore from "./SessionStore";
import UiStore from "./UiStore";
import AuthStore from "./AuthStore";
import ActivityStore from "./ActivityStore";
import UserStore from "./UserStore";

export default class RootStore {

    authStore: AuthStore;
    dashboardStore: DashboardStore;
    quizStore: QuizStore;
    questionStore: Questionstore;
    answerStore: AnswerStore;
    sessionStore: SessionStore;
    activityStore: ActivityStore;
    uiStore: UiStore;
    userStore: UserStore


    constructor() {
        this.authStore = new AuthStore(this);
        this.dashboardStore = new DashboardStore(this);
        this.quizStore = new QuizStore(this);
        this.questionStore = new QuestionStore(this);
        this.answerStore = new AnswerStore(this);
        this.sessionStore = new SessionStore(this);
        this.activityStore = new ActivityStore(this);
        this.uiStore = new UiStore(this);
        this.userStore = new UserStore(this);
    }
}