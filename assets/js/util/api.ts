import url from "./url";
import axios from "axios";
import Quiz from "../models/Quiz";
import {serialize} from "serializr";
import Answer from "../models/Answer";
import Question from "../models/Question";
import Session from "../models/Session";
import Activity from "../models/Activity";
import User from "../models/User";

export class authApi {


    static login = async (email: string, password: string) => await axios.post(url('/api/auth/login_check'), {
        email,
        password
    });


}

export class EntityApi {
    static get = async (iri: string) => await axios.get(url(iri));
    static delete = async (iri: string) => await axios.delete(url(iri));
    static put = async(iri: string, data: object) => await axios.put(url(iri), data);
}

export class QuizApi {
    static createQuiz = ({name}: { name: string }) => axios.post(url(Quiz.iri), {name});
}

export class SessionApi {
    static createSession = (session: Session) => axios.post(url(Session.iri), serialize(session));
    static getForQuiz = async (quiz: Quiz) => await axios.get(url(`${quiz.iri}/sessions`));
}


export class QuestionApi {
    static createQuestion = (questionData: {type: string, quiz: any}) => axios.post(url(Question.iri), questionData);

}

export class AnswerApi {
    static createAnswer = (answerData: { text: string, correct: boolean, question: string }) => axios.post(url(Answer.iri), answerData);
}

export class ActivityApi {
    static createActivity = (activityData: {session: string, question: string, answer: string|null, secondsForDecision: number|null}) => axios.post(url(Activity.iri), activityData);
}

export class UserApi {
    static loadQuizzes = (user: User) => axios.get(url(`${user.iri}/quizzes`));
    static savePassword = (user: User, password: string) => axios.put(url(`${user.iri}/update-password`), {
        ...serialize(user),
        password
    });

    static createUser = (user: {email: string, password: string}) => axios.post(url(User.iri), user);
}