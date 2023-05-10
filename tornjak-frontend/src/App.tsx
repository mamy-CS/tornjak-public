import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import store from 'redux/store';
import IsManager from './components/is_manager';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from 'react-redux'; //enables all components to have access to everything inside our react app
import NavigationBar from "./components/navbar";
import SelectServer from "./components/select-server";
import ClusterList from "./components/cluster-list";
import ClusterManagement from "./components/cluster-management";
import AgentList from "./components/agent-list";
import CreateJoinToken from "./components/agent-create-join-token";
import EntryList from "./components/entry-list";
import EntryCreate from "./components/entry-create";
import ServerManagement from "./components/server-management";
import TornjakServerInfo from "./components/tornjak-server-info";
import TornjakDashBoard from "./components/dashboard/tornjak-dashboard";
import DashboardDetailsRender from 'components/dashboard/dashboard-details-render';
import RenderOnAdminRole from 'components/RenderOnAdminRole'
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import SpireHealthCheck from 'components/spire-health-check';
import { ArgumentService } from "./configuration/ArgumentService";
//import { fetchData } from './components/helpers';
//console.log("service method performing an action with the following config: ", globalConfig.config);

// to enable SPIRE health check component
//const spireHealthCheck = (process.env.REACT_APP_SPIRE_HEALTH_CHECK_ENABLE === 'true') ?? false; // defualt value false
let spireHealthCheck = false;
function App() {
    //fetchData();
    const [envArguments, setData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await ArgumentService.getSomeDataFromApi();
            setData(response);
        };
        fetchData();
    }, []);
    console.log("data", envArguments)
    // to enable SPIRE health check component
    if(envArguments !== null) {
        spireHealthCheck = (envArguments.REACT_APP_SPIRE_HEALTH_CHECK_ENABLE === true) ?? false;
    }
    return (
        <div>
            <Provider store={store}>
                <Router>
                    <div>
                        <div className="nav-comp">
                            <NavigationBar 
                                envArguments={envArguments}
                            />
                        </div>
                        {spireHealthCheck &&
                            <div className="health-check">
                                <SpireHealthCheck />
                            </div>
                        }
                        <div className="rest-body">
                            <SelectServer />
                            <br />
                            {IsManager && <br />}
                            <Route path="/" exact component={AgentList} />
                            <Route path="/clusters" exact component={ClusterList} />
                            <Route path="/agents" exact component={AgentList} />
                            <Route path="/entries" exact component={EntryList} />
                            <RenderOnAdminRole>
                                <Route path="/entry/create" exact component={EntryCreate} />
                                <Route path="/agent/createjointoken" exact component={CreateJoinToken} />
                                <Route path="/cluster/clustermanagement" exact component={ClusterManagement} />
                            </RenderOnAdminRole>
                            <Route path="/tornjak/serverinfo" exact component={TornjakServerInfo} />
                            <Route path="/tornjak/dashboard" exact component={TornjakDashBoard} />
                            <Route
                                path="/tornjak/dashboard/details/:entity"
                                render={(props) => (<DashboardDetailsRender {...props} params={props.match.params} />)}
                            />
                            <Route path="/server/manage" exact component={ServerManagement} />
                            <br /><br /><br />
                            <svg className="endbanneroutput">
                                <rect className="endbanneroutput"></rect>
                            </svg>
                        </div>
                    </div>
                </Router>
            </Provider>
        </div>
    )
}

export default App
