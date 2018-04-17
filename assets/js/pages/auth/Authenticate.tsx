import * as React from "react";
import {inject, observer} from "mobx-react"
import {Button, Container, Form, Grid, Header, Input} from "semantic-ui-react";
import {observable} from "mobx";
import AuthStore from "../../stores/AuthStore";
import {Redirect} from "react-router";
import routes from "../../routes";
import UiStore from "../../stores/UiStore";
import Notification, {Type} from "../../models/Notification";


interface propTypes {
    authStore?: AuthStore,
    uiStore?: UiStore,
}

@inject("authStore", "uiStore") @observer
export default class Authenticate extends React.Component<propTypes, any> {
    [key: string]: any;
    @observable loggingIn: boolean = false;


    login = async () => {
        this.loggingIn = true;
        let notification;
        try {
            await this.props.authStore.login();
            notification = new Notification("Login was successful");

        } catch (err) {
            if (err.response.status === 401 && err.response.data.message === "Bad credentials") {
                notification = new Notification("Wrong email address or password", Type.NEGATIVE);
            }

        } finally {
            this.props.uiStore.addNotification(notification);
            this.loggingIn = false;
        }


    };

    handleChange = (event: React.FormEvent<HTMLInputElement>, data: any) => this.props.authStore[data.name] = data.value;

    render() {
        if(this.props.authStore.authenticated) {
            if (this.props.authStore.afterAuthGoTo !== undefined && this.props.authStore.afterAuthGoTo !== null) {
                const path = this.props.authStore.afterAuthGoTo;
                this.props.authStore.afterAuthGoTo = null;
                return <Redirect to={path}/>
            }
            return <Redirect to={routes.general.quizzes}/>
        }
        return <Container>
            <Grid centered stackable>
                <Grid.Column width={6}>
                    <Header size="large">Login</Header>
                    <Form>
                        <Form.Field>
                            <label>Email address</label>
                            <Input iconPosition="left" icon="at" type="text" name="email"
                                   value={this.props.authStore.email} onChange={this.handleChange}
                                   disabled={this.loggingIn}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <Input iconPosition="left" icon="lock" type="password" name="password"
                                   value={this.props.authStore.password} onChange={this.handleChange}
                                   disabled={this.loggingIn}
                            />
                        </Form.Field>
                    </Form>
                    <Button fluid primary onClick={this.login} loading={this.loggingIn}
                            disabled={this.loggingIn}>Login</Button>
                </Grid.Column>
            </Grid>


        </Container>
    }

}