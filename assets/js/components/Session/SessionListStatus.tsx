import * as React from "react";
import {action, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {default as Session, prettySessionStatus, SessionStatus} from "../../models/Session";
import {Label, Icon} from "semantic-ui-react";
import SessionStore from "../../stores/SessionStore";

interface propTypes {
    session: Session,
    sessionStore?: SessionStore
}

@inject('sessionStore') @observer
export default class SessionListStatus extends React.Component<propTypes, any> {

    @observable toggleSessionStatusRequestBusy: boolean = false;
    @observable previousStatus = '';
    @action
    toggleLock = async () => {
        this.previousStatus = this.props.session.status;
        if (this.props.session.status === SessionStatus.OPEN || this.props.session.status === SessionStatus.STARTED) {
            this.props.session.status = SessionStatus.FINISHED;
        } else {
            this.props.session.status = SessionStatus.OPEN;
        }
        try {
            this.toggleSessionStatusRequestBusy = true;
            await this.props.sessionStore.save(this.props.session);
        } catch (err) {
            this.props.session.status = this.previousStatus;
        } finally {
            this.toggleSessionStatusRequestBusy = false;
        }

    };

    render() {
        const session = this.props.session;
        let label;
        if(this.toggleSessionStatusRequestBusy) {

            label = <Label>...</Label>;

        } else {
            label = <Label onClick={this.toggleLock} style={{cursor: 'pointer'}}
                   color={session.status === SessionStatus.FINISHED ? "red" : "green"}>
                <Icon name={session.status === SessionStatus.FINISHED ? "lock" : "unlock"}/>
                {prettySessionStatus(session.status)}
            </Label>
        }

        return label;
    }
}