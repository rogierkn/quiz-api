import {EntityApi} from "../util/api";
import Entity from "../interfaces/Entity";
import RootStore from "./RootStore";
import {deserialize, serialize, update} from "serializr";
import {action, observable, ObservableMap} from "mobx";
import Session from "../models/Session";


export default abstract class EntityStore<T extends Entity> {
    [key: string]: any;

    rootStore: RootStore;
    @observable entities: ObservableMap<T> = observable.map();

    entityClass: typeof Entity;

    constructor(rootStore: RootStore, entityClass: typeof Entity) {
        this.rootStore = rootStore;
        this.entityClass = entityClass;
    }

    // abstract factory = ({json}: { json: any }) => Entity;

    @action
    factory = ({json}: {json:any}): T => {
        if (this.entities.has(json["@id"])) {
            return this.entities.get(json["@id"])
        } else {
            return this.newInstance();
        }
    };

    abstract newInstance() : T;

    async loadAll() {
        const iri = this.entityClass.iri;
        const {data} = await EntityApi.get(iri);

        return this.jsonToModel(data["hydra:member"]);
    }

    async loadByIri(iri: string): Promise<T> {
        const response = await EntityApi.get(iri);
        return this.jsonToModel(response.data as object);
    }

    jsonToModel(json: object[]): T[];
    jsonToModel(json: object): T;
    @action jsonToModel(json: any):any {
        return deserialize(this.entityClass as any, json); // Needs the as any because of Typescript limitations. entityClass is the Class of an entity and it is used by serializr
    };

    /**
     * Retrieve an entity. If an object is passed we assume it is a JSON object and deserialize it
     * If it is a string we assume it is an iri and then check if we already have it, if not load from server
     * @param {string | object} iri
     * @returns {Promise<Entity>}
     */
    async get(iri: string | object) {
        if (typeof iri === "object") {
            return this.jsonToModel(iri);
        } else {
            if (this.entities.has(iri)) {
                return this.entities.get(iri);
            } else {
                return await this.loadByIri(iri);
            }
        }
    }

    @action
    async delete(entity: T) {
        const response = await EntityApi.delete(entity.iri);
        if(response.status === 204) {
            this.entities.delete(entity.iri);
        }
        return response;
    }

    @action
    async save(entity: T) {
        const response = await EntityApi.put(entity.iri, serialize(entity));
        update(this.entityClass, entity, response.data);
        return response;
    }

    @action
    update(entity: T, data: any) {
        update(this.entityClass, entity, data);
    }





};

