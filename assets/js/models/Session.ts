import {computed, observable} from "mobx";
import Question from "./Question";
import {identifier, primitive} from "serializr";
import Entity from "../interfaces/Entity";
import Quiz from "./Quiz";
import Activity from "./Activity";
import * as moment from "moment";

export default class Session extends Entity {
    static iri = "/api/sessions";


    @observable uuid: string;
    @observable type: string;
    @observable createdAt: string;
    @observable quiz: Quiz;
    @observable status: string;
    @observable activities: Activity[] = [];

    @computed get moment() {
        return moment(this.createdAt);
    }
}


export const SessionStatus = {
    OPEN: 'OPEN',
    STARTED: 'STARTED',
    FINISHED: 'FINISHED',
};

export const SessionType = {
    GROUP: 'GROUP',
    INDIVIDUAL: 'INDIVIDUAL'
};

export const prettySessionType = (type: string) => {
    switch(type) {
        case SessionType.GROUP:
            return 'Group session';
        case SessionType.INDIVIDUAL:
            return 'Individual session';
    }
};

export const prettySessionStatus = (status: string) => {
    switch(status) {
        case SessionStatus.OPEN:
            return 'Open';
        case SessionStatus.STARTED:
            return 'Started';
        case SessionStatus.FINISHED:
            return 'Finished';
    }
};
