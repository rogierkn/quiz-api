import * as React from "react";
import {render} from "react-dom";
import {Provider} from "mobx-react"
import RootStore from "./stores/RootStore";
import App from "./App";
import "./theme/semantic.less";
import {BrowserRouter as Router} from "react-router-dom";


const rootStore = new RootStore();

rootStore.authStore.init();


render(
    <div>
        <Provider {...rootStore}>
            <Router>
                <App/>
            </Router>
        </Provider>

    </div>,
    document.getElementById("root")
);

// playing around in the console
(window as any).store = rootStore;
