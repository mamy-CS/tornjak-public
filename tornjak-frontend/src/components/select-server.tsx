import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import GetApiServerUri from './helpers';
import IsManager from './is_manager';
import TornjakApi from './tornjak-api-helpers';

import {
    serverSelectedFunc,
    serversListUpdateFunc,
    tornjakServerInfoUpdateFunc,
    serverInfoUpdateFunc,
    agentsListUpdateFunc,
    tornjakMessageFunc
} from 'redux/actions';

import { RootState } from 'redux/reducers';
import { AgentsListType, ServerInfoType } from 'redux/actions/types';

type SelectServerProp = {
    serversListUpdateFunc: (globalServersList: Array<string>) => void,
    serverSelectedFunc: (globalServerSelected: string) => void,
    serverInfoUpdateFunc: (globalServerInfo: ServerInfoType) => void,
    tornjakServerInfoUpdateFunc: (globalTornjakServerInfo: Object) => void,
    agentsListUpdateFunc: (globalAgentsList: AgentsListType[]) => void,
    tornjakMessageFunc: (globalErrorMessage: string) => void,
    globalServerSelected: string,
    globalTornjakServerInfo: Object,
    globalServersList: Array<string>,
    globalErrorMessage: string,
}
  
type SelectServerState = {

}

const ServerDropdown = (props: {name:string}) => (
    <option value={props.name}>{props.name}</option>
)

class SelectServer extends Component<SelectServerProp, SelectServerState> {
    TornjakApi: TornjakApi;
    constructor(props:SelectServerProp) {
        super(props);
        this.TornjakApi = new TornjakApi();
        this.serverDropdownList = this.serverDropdownList.bind(this);
        this.onServerSelect = this.onServerSelect.bind(this);

        this.state = {
        };
    }

    componentDidMount() {
        if (IsManager) {
            this.populateServers()
            if ((this.props.globalServerSelected !== "") && (this.props.globalErrorMessage === "OK" || this.props.globalErrorMessage === "")) {
                this.TornjakApi.populateTornjakServerInfo(this.props.globalServerSelected, this.props.tornjakServerInfoUpdateFunc, this.props.tornjakMessageFunc);
            }
            if ((this.props.globalTornjakServerInfo !== "") && (this.props.globalErrorMessage === "OK" || this.props.globalErrorMessage === "")) {
                this.TornjakApi.populateServerInfo(this.props.globalTornjakServerInfo, this.props.serverInfoUpdateFunc);
                this.TornjakApi.populateAgentsUpdate(this.props.globalServerSelected, this.props.agentsListUpdateFunc, this.props.tornjakMessageFunc)
            }
        }
    }

    componentDidUpdate(prevProps: SelectServerProp) {
        if (IsManager) {
            if (prevProps.globalServerSelected !== this.props.globalServerSelected ) {
                this.TornjakApi.populateTornjakServerInfo(this.props.globalServerSelected, this.props.tornjakServerInfoUpdateFunc, this.props.tornjakMessageFunc);
                this.TornjakApi.populateServerInfo(this.props.globalTornjakServerInfo, this.props.serverInfoUpdateFunc);
                this.TornjakApi.populateAgentsUpdate(this.props.globalServerSelected, this.props.agentsListUpdateFunc, this.props.tornjakMessageFunc);
            }
        }
    }

    populateServers() {
        //axios.get(GetApiServerUri("/manager-api/server/list"), { crossdomain: true })
        axios.get(GetApiServerUri("/manager-api/server/list"))
            .then(response => {
                this.props.serversListUpdateFunc(response.data["servers"]);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    serverDropdownList() {
        if (typeof this.props.globalServersList !== 'undefined') {
            return this.props.globalServersList.map((server: any) => {
                return <ServerDropdown key={server.name}
                    name={server.name} />
            })
        } else {
            return ""
        }
    }

    onServerSelect(e: { target: { value: string; }; } | undefined) {
        if (e === undefined) {
          return;
        }    
        const serverName = e.target.value;
        if (serverName !== "") {
            this.props.serverSelectedFunc(serverName);
        }
    }

    getServer(serverName: string) {
        var i;
        const servers: any = this.props.globalServersList
        for (i = 0; i < servers.length; i++) {
            if (servers[i].name === serverName) {
                return servers[i]
            }
        }
        return null
    }

    render() {
        let managerServerSelector = (
            <div id="server-dropdown-div">
                <label id="server-dropdown">Choose a Server</label>
                <div className="servers-drp-dwn">
                    <select name="servers" id="servers" onChange={this.onServerSelect}>
                        <optgroup label="Servers">
                            <option value="none" selected disabled>Select an Option </option>
                            <option value="none" selected disabled>{this.props.globalServerSelected} </option>
                            {this.serverDropdownList()}
                        </optgroup>
                    </select>
                </div>
            </div>
        )
        return (
            <div>
                {IsManager && managerServerSelector}
            </div>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    globalServerSelected: state.servers.globalServerSelected,
    globalServersList: state.servers.globalServersList,
    globalTornjakServerInfo: state.servers.globalTornjakServerInfo,
    globalErrorMessage: state.tornjak.globalErrorMessage,
})

export default connect(
    mapStateToProps,
    { serverSelectedFunc, serversListUpdateFunc, tornjakServerInfoUpdateFunc, serverInfoUpdateFunc, agentsListUpdateFunc, tornjakMessageFunc }
)(SelectServer)
