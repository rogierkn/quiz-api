import * as React from "react";
import {inject, observer} from "mobx-react";
import {Button, Label, Popup, Table, Grid, Header, Input, Divider} from "semantic-ui-react";
import User from "../../models/User";
import {EntityApi, UserApi} from "../../util/api";
import {serialize} from "serializr";
import {observable} from "mobx";
import UiStore from "../../stores/UiStore";
import Notification from "../../models/Notification";

interface propTypes {
    user: User,
    uiStore?: UiStore,
}

@inject('uiStore') @observer
export default class UserListRow extends React.Component<propTypes, any> {

    @observable loading: { [role: string]: boolean } = {
        ROLE_TEACHER: false,
        ROLE_ADMIN: false
    };

    @observable updatePasswordRequestBusy: boolean = false;

    @observable password: string = '';

    triggerRole = async (role: string) => {
        toggleRole(role, this.props.user);
        try {
            this.loading[role] = true;
            await EntityApi.put(this.props.user.iri, serialize(this.props.user));
        } catch (err) {
            toggleRole(role, this.props.user); //Toggle back
            this.props.uiStore.addNotification(new Notification(`Error while updating roles`, "red"));
        } finally {
            this.loading[role] = false;
        }
    };



    updatePassword = async () => {

        try {
            this.updatePasswordRequestBusy = true;
            await UserApi.savePassword(this.props.user, this.password);
            this.password = '';
            this.props.uiStore.addNotification(new Notification(`Password updated for ${this.props.user.email}`));
        } catch(err) {
            this.props.uiStore.addNotification(new Notification(`Error while updating password`, "red"));
        } finally {
            this.updatePasswordRequestBusy = false;
        }


    };


    render() {
        const user = this.props.user;

        return <Table.Row>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.roles.map(role => <Label key={role}
                                                       color={roleColor(role)}>{roleText(role)}</Label>)}</Table.Cell>
            <Table.Cell textAlign="center">
                <Popup flowing on="click" trigger={<Button circular icon="group"/>}>
                    <Button color="blue" loading={this.loading.ROLE_TEACHER}
                            basic={!user.roles.includes("ROLE_TEACHER")} content="Teacher"
                            onClick={() => this.triggerRole('ROLE_TEACHER')}/>
                    <Button color="red" loading={this.loading.ROLE_ADMIN} basic={!user.roles.includes("ROLE_ADMIN")}
                            content="Admin" onClick={() => this.triggerRole('ROLE_ADMIN')}/>
                </Popup>
                <Popup flowing on="click" trigger={<Button circular icon="asterisk" color="blue"/>}>
                    <Header>Update password</Header>
                    <Input type="text" disabled={this.updatePasswordRequestBusy} value={this.password} onChange={(e, data) => this.password = data.value} fluid/>
                    <Divider hidden/>
                    <Button fluid loading={this.updatePasswordRequestBusy} color="blue" onClick={this.updatePassword}>Update</Button>
                </Popup>

            </Table.Cell>
        </Table.Row>
    }
}

const toggleRole = (role: string, user: User) => {
    if (user.roles.includes(role)) {
        user.roles.splice(user.roles.indexOf(role), 1)
    } else {
        user.roles.push(role);
    }
};

const roleText = (role: string) => ((
        {
            ROLE_STUDENT: 'Student',
            ROLE_TEACHER: 'Teacher',
            ROLE_ADMIN: 'Admin'
        }as any)
        [role]
);

const roleColor = (role: string) => ((
        {
            ROLE_STUDENT: 'grey',
            ROLE_TEACHER: 'blue',
            ROLE_ADMIN: 'red'
        }as any)
        [role]
);