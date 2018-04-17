import {observable} from "mobx";
import {createModelSchema, list, primitive} from "serializr";
import Entity from "../interfaces/Entity";



export default class User extends Entity {
    static iri = "/api/users";


    get iri():string {
        return `${User.iri}/${this.id}`;
    }
    @observable email: string;
    @observable id: string;
    @observable roles: string[];


}

