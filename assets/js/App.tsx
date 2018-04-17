import * as React from "react";
import Quizzes from "./pages/quiz/Quizzes";
import {Route, Switch} from "react-router-dom";
import Header from "./components/App/Header";
import {Grid} from "semantic-ui-react";
import routes from "./routes";
import QuizEdit from "./pages/quiz/Edit";
import NotificationsList from "./components/NotificationsList";
import Host from "./pages/session/Host";
import {inject, observer} from "mobx-react";
import AuthStore from "./stores/AuthStore";
import Authenticate from "./pages/auth/Authenticate";
import AuthenticatedRoute from "./components/Common/AuthenticatedRoute";
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import ListForQuiz from "./pages/session/ListForQuiz";
import Results from "./pages/session/Results";
import PlayIndividual from "./pages/session/PlayIndividual";
import PlayGroup from "./pages/session/PlayGroup";
import Join from "./pages/session/Join";
import Share from "./pages/session/Share";
import QuizzesOverview from "./pages/admin/QuizzesOverview";
import UsersOverview from "./pages/admin/UsersOverview";
import Fallback from "./pages/Fallback";

interface propTypes {
    authStore?: AuthStore,
}

@inject('authStore')
@observer
class App extends React.Component<propTypes & RouteComponentProps<any>, any> {

    render() {
        return <div>
            <Header/>


            <Grid container={true}>
                <Grid.Row>

                    <Grid.Column width={16}>
                        <Switch>
                            <AuthenticatedRoute exact path={routes.session.results} component={Results}/>
                            <AuthenticatedRoute exact path={routes.session.listForQuiz} component={ListForQuiz}/>
                            <AuthenticatedRoute exact path={routes.quiz.edit} component={QuizEdit}/>
                            <AuthenticatedRoute exact path={routes.session.host} component={Host}/>
                            <AuthenticatedRoute exact path={routes.session.share} component={Share}/>
                            <AuthenticatedRoute exact path={routes.session.play.group} component={PlayGroup} />
                            <AuthenticatedRoute exact path={routes.session.play.individual} component={PlayIndividual} />
                            <AuthenticatedRoute exact path={routes.session.join} component={Join}/>
                            <AuthenticatedRoute exact path={routes.admin.quizzes} component={QuizzesOverview}/>
                            <AuthenticatedRoute exact path={routes.admin.users} component={UsersOverview}/>
                            <Route exact path="/authenticate" component={Authenticate}/>
                            <AuthenticatedRoute exact path={routes.general.quizzes} component={Quizzes}/>
                            <AuthenticatedRoute exact path={routes.general.dashboard} component={Fallback}/>
                        </Switch>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
            <NotificationsList/>
        </div>;
    }
}

export default withRouter(App);