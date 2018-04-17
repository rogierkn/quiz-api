import RootStore from "../stores/RootStore";
import {AxiosResponse} from "axios";
import Notification, {Type} from "../models/Notification";

export default class ValidatorHandler {
    private rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    forResponse({response}: { response: AxiosResponse }) {

        response.data.violations.forEach((violation: { message: string }) => {
            this.rootStore.uiStore.addNotification(new Notification(violation.message, Type.NEGATIVE));
        })


    }
}