import * as React from "react";
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import SessionStore from "../../stores/SessionStore";
import Session from "../../models/Session";
import {Grid, Header, Loader, Segment} from "semantic-ui-react";
import route from "../../util/route";
import routes from "../../routes";
import url from "../../util/url";
import * as QRCode from 'qrcode';
import * as CopyToClipboard from "react-copy-to-clipboard";
import UiStore from "../../stores/UiStore";
import Notification from "../../models/Notification";

interface propTypes {
    match: { params: { id: string } }
    sessionStore?: SessionStore
    uiStore?: UiStore
}

@inject('sessionStore', 'uiStore') @observer
export default class Share extends React.Component<propTypes, any> {

    @observable session: Session;
    @observable qrCode: any;

    @computed get url() {
        return url(route(routes.session.join, {id: this.session.id}));
    }

    async componentDidMount() {
        this.session = await this.props.sessionStore.get(Session.idToIri(this.props.match.params.id));

        this.qrCode = await QRCode.toDataURL(this.url,
            {
                scale: 10,
                color: {
                    light: '#0000'
                }
            });

    }

    render() {
        if (!this.session || !this.session.quiz) {
            return <Loader active/>
        }

        return <Segment padded="very" style={{marginTop: '30px'}}>
            <Grid textAlign="center">
                <Header size="large" textAlign="center">{this.session.quiz.name}</Header>
                <Grid.Row verticalAlign="middle">
                    <Grid.Column width={6}>
                        <Header>Instructions</Header>
                        <p>Share the link on the right with the people that should play this quiz.</p>
                        <p>Close the session whenever you want and then view the results of the quiz.</p>
                    </Grid.Column>

                    <Grid.Column width={6} floated="right">

                        <Header>Share the following link</Header>
                        <CopyToClipboard text={this.url}
                                         onCopy={() => this.props.uiStore.addNotification(new Notification("Link copied!"))}>
                            <Header size="huge"
                                    style={{textDecoration: 'underline dotted', cursor: 'pointer'}}>{this.url}</Header>
                        </CopyToClipboard>
                        <Header>or the qr code</Header>

                        <img src={this.qrCode}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>;
    }
}