import * as React from "react";
import {computed, observable, reaction} from "mobx";
import {observer} from "mobx-react";
import {Button, Grid, Header, Segment, Statistic, Transition} from "semantic-ui-react";
import GroupHostSessionService from "../../../../services/GroupHostSessionService";
import * as QRCode from "qrcode";
import url from "../../../../util/url";
import route from "../../../../util/route";
import routes from "../../../../routes";

interface propTypes {
    sessionService: GroupHostSessionService,
}

@observer
export default class Lobby extends React.Component<propTypes, any> {

    @observable qrCode: any;

    dispose: any;

    @observable animate: boolean = true;

    @computed get url() {
        return url(route(routes.session.join, {id: this.props.sessionService.session.id}));
    }


    async componentDidMount() {

        this.dispose = reaction(() => this.props.sessionService.playerCount
            , () => {
                this.animate = !this.animate;
            });

        this.qrCode = await QRCode.toDataURL(this.url,
            {
                scale: 10,
                color: {
                    light: '#0000'
                }
            });
    }

    componentWillUnmount() {
        this.dispose();
    }

    render() {
        return <Grid textAlign="center" style={{marginTop: '30px'}}>
            <Grid.Row verticalAlign="middle">
                <Grid.Column width={6}>
                    <Statistic size="huge">
                        <Statistic.Value>
                            <Transition duration={800} visible={this.animate}
                                        animation="pulse"><span>{this.props.sessionService.playerCount}</span></Transition>
                        </Statistic.Value>
                        <Statistic.Label>Players</Statistic.Label>
                    </Statistic>
                </Grid.Column>

                <Grid.Column width={6} floated="right" as={Segment}>
                    <Header>Join by going to</Header>
                    <Header size="huge">{this.url}</Header>
                    <Header>or</Header>

                    <img src={this.qrCode}/>
                </Grid.Column>
            </Grid.Row>
            <Button primary size="huge" onClick={this.props.sessionService.startSession}>Start quiz</Button>


        </Grid>;
    }
}