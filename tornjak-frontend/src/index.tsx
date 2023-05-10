import React, {ReactElement} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import KeycloakService from "./auth/KeycloakAuth";
import axios from "axios";
import {
  defaultConfig,
  globalConfig,
  globalConfigUrl
} from "./configuration/config";
import store from './redux/store';

const state = store.getState();
const envArguments = state.tornjak.globalEnvArguments;
console.log("hi", envArguments)

//const renderApp = () => ReactDOM.render(<App />, document.getElementById('root'));
const app: ReactElement = <App />;
axios
  .get(globalConfigUrl)
  .then((response) => {
    globalConfig.set(response.data);
    return app;
  })
  .catch((e) => {
    if (process.env.NODE_ENV === "development") {
      globalConfig.set(defaultConfig);
      return app;
    } else {
      const errorMessage =
        "Error while fetching global config, the App wil not be rendered. (This is NOT a React error.)";
      return (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      );
    }
  })
  .then((reactElement: ReactElement) => {
    if (envArguments.REACT_APP_AUTH_SERVER_URI || envArguments.REACT_APP_AUTH_SERVER_URI !== "") { // with Auth for testing purposes
      console.log("yessss")
      KeycloakService.initKeycloak(ReactDOM.render(reactElement, document.getElementById("root")));
    } else {
      ReactDOM.render(reactElement, document.getElementById("root"));
    }
  });

// if (process.env.REACT_APP_AUTH_SERVER_URI) { // with Auth for testing purposes
//   KeycloakService.initKeycloak(renderApp);
// } else {
//   renderApp(); // without Auth
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
