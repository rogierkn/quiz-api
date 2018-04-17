import {autorun, computed, observable} from "mobx";
import axios, {AxiosError, AxiosResponse} from "axios";
import RootStore from "./RootStore";
import {authApi} from "../util/api";
import Notification, {Type} from "../models/Notification";
import {alias, createModelSchema, deserialize, list, primitive} from "serializr";
import User from "../models/User";

export default class AuthStore {
    [key: string]: any;


    @observable token: string;
    @observable authenticated: boolean = false;
    @observable email: string = '';
    @observable password: string = '';




    @computed get user(): User {
        return deserialize(User, JSON.parse(atob(this.token.split('.')[1]))); // JWT payload is always at index 1
    }

    afterAuthGoTo: string;


    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        createModelSchema(User, {
            id: primitive(),
            email: alias('username', primitive()),
            roles: list(primitive())
        });


    }

    init() {
        this.token = JSON.parse(localStorage.getItem('token')) || null;

        // Auto update axios config whenever the token changes
        autorun(() => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        });


        axios.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: AxiosError) => {

                if (error.hasOwnProperty('response') && error.response.hasOwnProperty('status') && error.response.status === 401) {
                    this.authenticated = false;
                    this.setToken(null);
                    if(error.response.data.message === "Expired JWT Token") { // Only add notification if we are sure server says it has expired
                        this.rootStore.uiStore.addNotification(new Notification("Please re-authenticate", Type.NEGATIVE));
                    }
                }
                return Promise.reject(error);
            });

        // If the token is not null we assume the user is logged in
        if (this.token !== null) {
            this.authenticated = true;
        }
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', JSON.stringify(token));
    }

    async login() {
        const response = await authApi.login(this.email, this.password);
        if (response.status === 200 && response.data.hasOwnProperty('token')) {
            this.setToken(response.data.token as string);
            this.authenticated = true;

            this.email = '';
            this.password = '';
        }
        return response;
    }

    async logout() {
        this.setToken(null);
        this.authenticated = false;
    }


}
