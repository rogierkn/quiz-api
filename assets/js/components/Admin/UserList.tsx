import * as React from "react";
import {inject, observer} from "mobx-react";
import Quiz from "../../models/Quiz";
import {Button, Container, Grid, Table} from "semantic-ui-react";
import routes from "../../routes";
import route from "../../util/route";
import {Link} from "react-router-dom";
import PaginationInterface from "../../interfaces/Pagination";
import QuizStore from "../../stores/QuizStore";
import {observable, ObservableMap} from "mobx";
import UserStore from "../../stores/UserStore";
import User from "../../models/User";
import UserListRow from "./UserListRow";

interface propTypes {
    users: ObservableMap<User>,
    pagination: PaginationInterface,
    paginate: (iri: string) => Promise<void>,
    userStore?: UserStore
}

@inject('userStore') @observer
export default class UserList extends React.Component<propTypes, any> {


    render() {
        const users = this.props.users.values().sort((a: User, b: User) => a.email.localeCompare(b.email));
        return <Container>
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Roles</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {users.map(user => <UserListRow key={user.id} user={user}/>)}
                </Table.Body>
            </Table>
            <Grid columns={2}>
                <Grid.Column floated="left">
                    <Button.Group>
                        <Button disabled={this.props.pagination["hydra:first"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:first"])}>First</Button>
                        <Button disabled={this.props.pagination["hydra:previous"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:previous"])}>Previous</Button>
                    </Button.Group>
                </Grid.Column>
                <Grid.Column floated="right" textAlign="right">
                    <Button.Group>
                        <Button disabled={this.props.pagination["hydra:next"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:next"])}>Next</Button>
                        <Button disabled={this.props.pagination["hydra:last"] === undefined}
                                onClick={() => this.props.paginate(this.props.pagination["hydra:last"])}>Last</Button>
                    </Button.Group>
                </Grid.Column>
            </Grid>
        </Container>;
    }
}