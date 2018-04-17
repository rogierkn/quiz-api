import * as React from "react";
import {inject, observer} from "mobx-react";
import {Table} from "semantic-ui-react";
import Session, {prettySessionType} from "../../models/Session";
import Quiz from "../../models/Quiz";
import Activity from "../../models/Activity";
import SessionStore from "../../stores/SessionStore";
import {History} from "history";
import SessionListActions from "./SessionListActions";
import SessionListStatus from "./SessionListStatus";

interface propTypes {
    quiz: Quiz,
    sessions: Session[],
    sessionStore?: SessionStore,
    history: History
}

@inject('sessionStore') @observer
export default class SessionList extends React.Component<propTypes, any> {


    render() {
        return <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>UUID</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Created</Table.HeaderCell>
                    <Table.HeaderCell>Players</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.props.sessions.sort((a: Session, b: Session) => new Date(b.createdAt) as any - (new Date(a.createdAt) as any)).map((session: Session) =>
                    <Table.Row key={session.uuid}>
                        <Table.Cell>{session.uuid}</Table.Cell>
                        <Table.Cell>{prettySessionType(session.type)}</Table.Cell>
                        <Table.Cell style={{textDecoration: 'underline dotted'}}
                                    title={session.moment.format('D-M-Y')}>{session.moment.fromNow()}</Table.Cell>
                        <Table.Cell>{session.activities.reduce(
                            (userIris: any, activity: Activity) => {
                                if (!userIris.includes(activity.user)) userIris.push(activity.user);
                                return userIris;
                            },
                            []).length
                        }</Table.Cell>
                        <Table.Cell>
                            <SessionListStatus session={session}/>
                        </Table.Cell>
                        <Table.Cell>
                            <SessionListActions session={session} history={this.props.history}/>
                        </Table.Cell>
                    </Table.Row>)}
            </Table.Body>
        </Table>;
    }
}