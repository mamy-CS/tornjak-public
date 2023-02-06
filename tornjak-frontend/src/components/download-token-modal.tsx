import React, { Component } from 'react';
import { connect } from 'react-redux';
//import IsManager from './is_manager';
//import { ModalWrapper, NumberInput, TextArea, Button } from "carbon-components-react";
import { ModalWrapper, TextArea } from "carbon-components-react";
import TornjakApi from "./tornjak-api-helpers"
import { RootState } from 'redux/reducers';
import { saveAs } from "file-saver";
//import { IoDownloadOutline } from "react-icons/io5";

type DownloadTokenProp = {
  // access token of the session
  globalAccessToken: string | undefined
}

type DownloadTokenState = {}

class DownloadToken extends Component<DownloadTokenProp, DownloadTokenState> {
  TornjakApi: TornjakApi;
  constructor(props: DownloadTokenProp) {
    super(props);
    this.TornjakApi = new TornjakApi(props);
    this.state = {
      ttl: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeTtl = this.onChangeTtl.bind(this);
    this.applyChangeTtl = this.applyChangeTtl.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  // TODO(mamy-CS): e - any for now will be explicitly typed on currently open entry create PR
  onChangeTtl(e: any): void {
    this.setState({
      ttl: Number(e.target.value)
    });
  }

  applyChangeTtl() {
    return true;
  }

  handleSubmit = () => {
    var accessToken = this.props.globalAccessToken, token = [], jsonInit = "{\n  \"access-token\": [\n";
    if (accessToken !== "") {
      token[0] = jsonInit;
      token[1] = accessToken + "\n]\n}";
    }
    var blob = new Blob(token, { type: "application/json" });
    saveAs(
      blob,
      "accessToken.json"
    );
    return true;
  };

  render() {

    return (
      <div>
        <ModalWrapper
          triggerButtonKind="ghost"
          buttonTriggerText="Export Access Token"
          primaryButtonText="Export to JSON"
          handleSubmit={this.handleSubmit}
          shouldCloseAfterSubmit={true}
        >
          <p> Download Access Token </p>
          <br />
          <div className="selectors-textArea">
            <TextArea
              cols={100}
              id="access-token-textArea"
              invalidText="Access Token Undefined"
              labelText="Access Token"
              placeholder={this.props.globalAccessToken}
              defaultValue={this.props.globalAccessToken}
              rows={8}
              disabled
            />
          </div>
          {/* <div className='token-ttl'>
            <NumberInput
              helperText="Ttl for the access token issued for this client (In days)"
              id="ttl-input"
              invalidText="Number is not valid"
              label="Time to Leave (Ttl)"
              min={0}
              step={1}
              value={0}
              onChange={this.onChangeTtl}
            />
          </div>
          <div className='apply-change-ttl-token'>
            <Button
              size="sm"
              kind="tertiary"
              onClick={() => {
                this.applyChangeTtl();
              }}>
              Apply
            </Button>
          </div> */}
        </ModalWrapper>
      </div>
    )
  }
}


const mapStateToProps = (state: RootState) => ({
  globalAccessToken: state.auth.globalAccessToken,
})

export default connect(
  mapStateToProps,
  {}
)(DownloadToken)

export { DownloadToken };