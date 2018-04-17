import {action, observable} from "mobx";
import Quiz from "../models/Quiz";
import RootStore from "./RootStore";
import {QuizApi} from "../util/api";


export default class DashboardStore {
    private rootStore: RootStore;



    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }





};