import {createModelSchema, identifier, list, primitive, reference} from "serializr";
import RootStore from "./RootStore";
import Quiz from "../models/Quiz";
import {SessionApi} from "../util/api";
import Session from "../models/Session";
import EntityStore from "./EntityStore";
import Activity from "../models/Activity";
import User from "../models/User";


export default class UserStore extends EntityStore<User> {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        super(rootStore, User);

        createModelSchema(User, {
            "@context": primitive(),
            "@id": identifier((iri, object) => this.entities.set(iri, object)),
            "@type": primitive(),
            id: primitive(),
            email: primitive(),
            roles: list(primitive())
        }, this.factory);
    }

    newInstance(): User {
        return new User();
    };




}