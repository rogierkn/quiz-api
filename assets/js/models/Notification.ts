import {observable} from "mobx";


export default class Notification {
    id: string;
    @observable message: string;
    @observable type: string;
    persists: boolean;
    @observable willBeRemoved: boolean = false;

    constructor(message: string, type: string = "green", persists = false) {
        this.id = Math.round(Math.random() * 100) + "-" + Date.now(); // okay-ish for local id
        this.message = message;
        this.type = type;
        this.persists = persists;
    }
}

export const Type  = {
    POSITIVE: 'green',
    NEGATIVE: 'red'
};