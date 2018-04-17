import {Button, Container, Menu, Responsive, Dropdown} from "semantic-ui-react";
import * as React from "react";
import {inject, observer} from "mobx-react";
import AuthStore from "../../stores/AuthStore";
import {Route, RouteComponentProps, withRouter} from "react-router";
import routes from "../../routes";


interface propTypes {
    authStore?: AuthStore
}

@inject('authStore') @observer
class Header extends React.Component<propTypes & RouteComponentProps<any>, any> {


    render() {
        return <NavBar/>;
    }
}

export default withRouter(Header);


@inject('authStore') @observer
class NavBarMobile extends React.Component<any & RouteComponentProps<any>, any> {

    render() {
        return <Menu>
            <Menu.Menu position="left">
                <Menu.Item header>Quizee</Menu.Item>

                { this.props.authStore.authenticated && this.props.authStore.user.roles.includes("ROLE_TEACHER") && <Route path={'/'} exact children={({location, match, history}) =>
                    <Menu.Item onClick={() => history.push('/')} link
                               name='Quizzes' active={!!match}/>}
                />}

                {/* Only show this menu item to admins */
                    this.props.authStore.authenticated && this.props.authStore.user.roles.includes("ROLE_ADMIN") &&
                    <Route path={'/admin'}
                           children={({location, match, history}) => {
                               return <Dropdown text='Admin' pointing className={`link item ${match !== null ? 'active' : ''}`} >
                                   <Dropdown.Menu>
                                       <Dropdown.Item onClick={() => history.push(routes.admin.quizzes)}>Quizzes</Dropdown.Item>
                                       <Dropdown.Item onClick={() => history.push(routes.admin.users)}>Users</Dropdown.Item>
                                   </Dropdown.Menu>
                               </Dropdown>
                           }}/>
                }
            </Menu.Menu>
            <Menu.Menu position="right">
                {
                    this.props.authStore.authenticated &&
                    <Menu.Item>
                        <Button basic onClick={() => this.props.authStore.logout()} color="blue">Logout</Button>
                    </Menu.Item>
                }
            </Menu.Menu>
        </Menu>
    }
}

@inject('authStore') @observer
class NavBarDesktop extends React.Component<{authStore?: AuthStore} & RouteComponentProps<any>, any> {
    render() {
        return <Menu color="blue">

            <Container>
                <Menu.Item header>Quizee</Menu.Item>
                {this.props.authStore.authenticated && this.props.authStore.user.roles.includes("ROLE_TEACHER") && <Route path={'/'} exact children={({location, match, history}) =>
                    <Menu.Item onClick={() => history.push('/')} link
                               name='Quizzes' active={match != null}/>}
                />}


                {/* Only show this menu item to admins */
                    this.props.authStore.authenticated && this.props.authStore.user.roles.includes("ROLE_ADMIN") &&
                    <Route path={'/admin'}
                           children={({location, match, history}) => {
                               return <Dropdown text='Admin' pointing className={`link item ${match !== null ? 'active' : ''}`} >
                                   <Dropdown.Menu>
                                       <Dropdown.Item onClick={() => history.push(routes.admin.quizzes)}>Quizzes</Dropdown.Item>
                                       <Dropdown.Item onClick={() => history.push(routes.admin.users)}>Users</Dropdown.Item>
                                   </Dropdown.Menu>
                               </Dropdown>
                           }}/>
                }


                <Menu.Menu position="right">
                    {
                        this.props.authStore.authenticated &&
                        <Menu.Item>
                            <Button basic onClick={() => this.props.authStore.logout()} color="blue">Logout</Button>
                        </Menu.Item>
                    }
                </Menu.Menu>
            </Container>
        </Menu>;
    }
}


class NavBar extends React.Component<any, any> {
    render() {
        const Desktop = withRouter(NavBarDesktop);
        const Mobile = withRouter(NavBarMobile);
        return (
            <div style={{marginBottom: '30px'}}>
                <Responsive {...Responsive.onlyMobile}>
                    {<Mobile/>}
                </Responsive>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    {<Desktop/>}
                </Responsive>
            </div>
        );
    }
}
withRouter(NavBar);



