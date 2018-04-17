
export interface CurrentQuestion {
    iri: string,
    text: string
    answers: CurrentAnswer[],
    displayType: string,
}

export interface CurrentAnswer {
    iri: string,
    text: string,
}