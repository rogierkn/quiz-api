
export default abstract class Entity {
    [key: string]: any;

    "@context": string;
    "@id": string;
    "@type": string;
    id: string;

    static iri: string;

    public static idToIri(id: string): string {
        if(id === undefined || id === null || id.trim() === "") {
            return this.iri;
        }
        return `${this.iri}/${id}`;
    }

    /**
     * IRI getter because writing entity["@id"} constantly blows...
     * @returns {string}
     */
    get iri() {
        return this["@id"];
    }
}