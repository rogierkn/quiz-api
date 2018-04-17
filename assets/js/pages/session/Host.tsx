import * as React from "react";
import {observable, computed, action, autorun} from "mobx";
import {inject, observer} from "mobx-react";
import {Container, Header, Loader} from "semantic-ui-react";
import SessionStore from "../../stores/SessionStore";
import Quiz from "../../models/Quiz";
import Session from "../../models/Session";
import GroupHosting from "../../components/Session/GroupHosting";
import routes from "../../routes";
import url from "../../util/url";
import route from "../../util/route";
import * as QRCode from "qrcode";

interface propTypes {
    sessionStore?: SessionStore,
    match: { params: { id: string } }
}


@inject("sessionStore") @observer
export default class Host extends React.Component<propTypes, any> {

    @observable session: Session;


    async componentDidMount() {
        this.session = await this.props.sessionStore.loadByIri(Session.idToIri(this.props.match.params.id)); // Force a fresh load of the session

    }


    render() {

        if(this.session === undefined || this.session.quiz === undefined ) {
            return <Loader active/>
        }

        return <Container>
            <GroupHosting session={this.session} />
        </Container>
    }
}