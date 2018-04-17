import {action, observable, ObservableMap, runInAction} from "mobx";
import Notification, {Type} from "../models/Notification";
import RootStore from "./RootStore";
import axios, {AxiosError, AxiosResponse} from "axios";


export default class UiStore {

    rootStore: RootStore;

    @observable notifications: ObservableMap<Notification> = observable.map();

    @observable isPlayingQuiz: boolean = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;



        axios.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {

                if (error.hasOwnProperty('response')) {

                    switch(error.response.status) {
                        case 400: {
                            if(error.response.data.hasOwnProperty('violations')) {
                                error.response.data.violations.forEach((violation: { message: string, property: string }) => {
                                    this.addNotification(new Notification(violation.message, Type.NEGATIVE));
                                });
                            }
                            break;
                        }
                        case 403: {
                            if(error.response.data["hydra:description"] === "Access Denied.") {
                                this.addNotification(new Notification("You have no access to that", Type.NEGATIVE));
                            }
                            break;
                        }
                    }
                }
                return Promise.reject(error);
            });

    }

    @action addNotification = (notification: Notification) => {

        this.notifications.set(notification.id, notification);
        if (!notification.persists) {

            // Mark the notification as "will be removed", this triggers exit transition
            setTimeout(() => runInAction(() => {
                notification.willBeRemoved = true;
            }), 3000);


            // Wait a second (4-3) and actually remove the notification
            setTimeout(() => runInAction(() => {
                this.notifications.delete(notification.id);
            }), 4000);
        }

    }

}