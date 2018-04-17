import * as React from "react";
import {computed} from "mobx";
import {inject, observer} from "mobx-react";
import {Grid, Segment, SemanticCOLORS, Transition} from "semantic-ui-react";
import UiStore from "../stores/UiStore";
import Notification from "../models/Notification";

interface propTypes {
    uiStore?: UiStore
}

@inject("uiStore") @observer
export default class NotificationsList extends React.Component<propTypes, any> {

    @computed get visible() {
        return this.props.uiStore.notifications.size > 0;
    }


    render() {
        if (!this.visible) return null;

        return <Grid className="notifications" container={true} centered>
            {
                this.props.uiStore.notifications.values().map((notification: Notification) => <Transition
                    key={notification.id} transitionOnMount visible={!notification.willBeRemoved} animation='slide up'
                    duration={500}>
                    <Grid.Row centered key={notification.id} columns={1}>

                        <Segment
                            as={Grid.Column}
                            textAlign="center" width={7}
                            compact
                            color={notification.type as SemanticCOLORS} inverted
                            >
                                <p>{notification.message}</p>
                        </Segment>

                    </Grid.Row>
                </Transition>)
            }
        </Grid>

    }
}