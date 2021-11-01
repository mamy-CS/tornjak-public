import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion, AccordionItem, Tag } from "carbon-components-react";
import IsManager from './is_manager';
import TornjakApi from './tornjak-api-helpers';
import {
  serverSelectedFunc,
  serverInfoUpdateFunc,
  tornjakServerInfoUpdateFunc,
  tornjakMessageFunc,
} from 'redux/actions';
import PropTypes from "prop-types";

const pluginTagColorMapper = {
  "NodeAttestor": "red",
  "WorkloadAttestor": "green",
  "KeyManager": "cyan",
  "NodeResolver": "blue",
  "Notifier": "teal",
  "DataStore": "purple",
}

const PluginTags = props => (
  <p>{props.names.map(v => <Tag type={pluginTagColorMapper[props.type]} >{props.type + ": " + v}</Tag>)}</p>
)
const TornjakServerInfoDisplay = props => (
  <Accordion>
    <AccordionItem title="Trust Domain" open>
      <p>
        {props.tornjakServerInfo.trustDomain}
      </p>
    </AccordionItem>
    <AccordionItem title="Plugins" open>
      <table>
        {
          Object.entries(props.tornjakServerInfo.plugins).map(([key, value]) =>
            <tr key={key + ":" + value}><PluginTags type={key} names={value} /></tr>)
        }
      </table>
    </AccordionItem>
    <AccordionItem title="Verbose Config (click to expand)">
      <pre>
        {props.tornjakServerInfo.verboseConfig}
      </pre>
    </AccordionItem>
  </Accordion>
)

class TornjakServerInfo extends Component {
  constructor(props) {
    super(props);
    this.TornjakApi = new TornjakApi();
    this.state = {};
  }

  componentDidMount() {
    if (IsManager) {
      if (this.props.globalServerSelected !== "") {
        this.TornjakApi.populateTornjakServerInfo(this.props.globalServerSelected, this.props.tornjakServerInfoUpdateFunc, this.props.tornjakMessageFunc);
      }
    } else {
      this.TornjakApi.populateLocalTornjakServerInfo(this.props.tornjakServerInfoUpdateFunc, this.props.tornjakMessageFunc);
    }
  }

  componentDidUpdate(prevProps) {
    if (IsManager) {
      if (prevProps.globalServerSelected !== this.props.globalServerSelected) {
        this.TornjakApi.populateTornjakServerInfo(this.props.globalServerSelected, this.props.tornjakServerInfoUpdateFunc, this.props.tornjakMessageFunc)
      }
    }
  }

  tornjakServerInfo() {
    if (this.props.globalTornjakServerInfo === "") {
      return ""
    } else {
      return <TornjakServerInfoDisplay tornjakServerInfo={this.props.globalTornjakServerInfo} />
    }
  }

  render() {
    return (
      <div data-test="tornjak-server">
        <h3>Server Info</h3>
        {this.props.globalErrorMessage !== "OK" &&
          <div className="alert-primary" role="alert">
            <pre>
              {this.props.globalErrorMessage}
            </pre>
          </div>
        }
        <br /><br />
        {this.tornjakServerInfo()}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  globalServerSelected: state.servers.globalServerSelected,
  globalServerInfo: state.servers.globalServerInfo,
  globalTornjakServerInfo: state.servers.globalTornjakServerInfo,
  globalErrorMessage: state.tornjak.globalErrorMessage,
})

TornjakServerInfo.propTypes = {
  globalServerSelected: PropTypes.string,
  globalServerInfo: PropTypes.object,
  globalTornjakServerInfo: PropTypes.object,
  globalErrorMessage: PropTypes.string,
  serverSelectedFunc: PropTypes.func,
  tornjakServerInfoUpdateFunc: PropTypes.func,
  serverInfoUpdateFunc: PropTypes.func,
  tornjakMessageFunc: PropTypes.func,

};

export default connect(
  mapStateToProps,
  { serverSelectedFunc, tornjakServerInfoUpdateFunc, serverInfoUpdateFunc, tornjakMessageFunc }
)(TornjakServerInfo)

export { TornjakServerInfo };