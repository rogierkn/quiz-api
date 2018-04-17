import * as React from "react";
import {observable, ObservableMap} from "mobx";
import {inject, observer} from "mobx-react";
import {EntityApi, UserApi} from "../../util/api";
import Pagination from "../../interfaces/Pagination";
import User from "../../models/User";
import UserStore from "../../stores/UserStore";
import UserList from "../../components/Admin/UserList";
import {Button, Container, Divider, Form, Modal, TextArea} from "semantic-ui-react";
import {parse} from "papaparse";
import UiStore from "../../stores/UiStore";
import Notification from "../../models/Notification";


interface propTypes {
    userStore?: UserStore,
    uiStore?: UiStore
}


/**
 * Because the admin view has different requirements than normal views we use no stores here, keep the entities
 */

@inject('userStore', 'uiStore') @observer
export default class UsersOverview extends React.Component<propTypes, any> {

    loadedCallback = () => {
    };

    @observable users: ObservableMap<User> = observable.map();
    @observable page: number = 0;
    @observable pagination: Pagination = {
        ["@id"]: undefined,
        ["hydra:first"]: undefined,
        ["hydra:last"]: undefined,
        ["hydra:next"]: undefined,
        ["hydra:previous"]: undefined,
    };

    @observable usersCsv: string = '';
    @observable createUsersRequestCount: number = 0;

    async componentDidMount() {
        this.loadUsers(`${User.iri}.jsonld?paginate=true&page=1`);
    }

    loadUsers = async (iri: string) => {
        if (iri === undefined) {
            return;
        }
        const {data} = await EntityApi.get(iri);
        this.users = observable.map();
        (await this.props.userStore.jsonToModel(data["hydra:member"])).forEach(user => this.users.set(user.iri, user));
        this.pagination = data["hydra:view"] ? data["hydra:view"] : this.pagination;

        this.loadedCallback();
    };

    componentWillUnmount() {
        // If we leave admin view we don't want these quizzes to clutter up other views
        this.props.userStore.entities.clear();
        // Incase request is still async loading make sure we clean up when finished
        this.loadedCallback = () => this.props.userStore.entities = observable.map()
    }


    createUsers = async () => {
        const parsed = parse("email,password\n" + this.usersCsv, {header: true});
        if (parsed.errors.length > 0) {
            this.props.uiStore.addNotification(new Notification('Unable to parse the csv text', "red"));
            return;
        }
        const userData = parsed.data as [{ email: string, password: string }];


        try {

            userData.forEach(async (user) => {
                this.createUsersRequestCount++;
                try {
                    const response = await UserApi.createUser(user);
                    const createdUser = this.props.userStore.jsonToModel(response.data as object);
                    this.users.set(createdUser.iri, createdUser)
                } finally {
                    this.createUsersRequestCount--;
                }
            });
        } catch (err) {
            console.log(err);
        }

    };


    render() {

        return <Container>

            <Modal trigger={<Button color="green">Create users</Button>}>
                <Modal.Header>Create new users</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <p>Use a comma separated list of users</p>
                        <Form>
                            <TextArea disabled={this.createUsersRequestCount > 0} placeholder={"john@doe.com,cobblestone\njane@aol.com,tastybeer"}
                                      value={this.usersCsv}
                                      onChange={(e, data) => this.usersCsv = (data.value as string)}/>
                        </Form>
                        <Button loading={this.createUsersRequestCount > 0} positive onClick={this.createUsers}>Create users</Button>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

            <Divider hidden/>
            <UserList users={this.users}
                      pagination={this.pagination}
                      paginate={this.loadUsers}
            />
        </Container>
    }
}