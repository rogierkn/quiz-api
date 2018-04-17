import * as React from "react";
import {observable} from "mobx";
import {inject, observer} from "mobx-react";
import Session from "../../models/Session";
import {Card, Loader} from "semantic-ui-react";
import SessionStore from "../../stores/SessionStore";
import Question from "../../models/Question";
import Answer from "../../models/Answer";
import ResultAnswerInformation from "../../components/Session/Results/ResultAnswerInformation";
import GeneralOverview from "../../components/Session/Results/GeneralOverview";

interface propTypes {
    match: { params: { id: string } },
    sessionStore?: SessionStore
}

@inject('sessionStore') @observer
export default class Results extends React.Component<propTypes, any> {

    @observable session: Session;

    async componentDidMount() {
        this.session = await this.props.sessionStore.loadByIri(Session.idToIri(this.props.match.params.id));
    }

    render() {
        if (!this.session || !this.session.quiz || !this.session.quiz.questions || !this.session.activities) {
            return <Loader active/>
        }

        return <GeneralOverview session={this.session}/>;
    }
}