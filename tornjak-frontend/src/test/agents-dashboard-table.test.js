import React from "react";
import { AgentDashboardTable } from "../components/dashboard/agents-dashboard-table";
import { findByTestId, checkProps } from "../../Utils";
import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Agents Dashboard Table Component", () => {
  const props = {
    classes: {},
    numRows: 1,
    filterByCluster: "Test String",
    filterByAgentId: "Test String",
    globalAgents: {},
    globalEntries: {},
    globalClickedDashboardTable: "Test String",
  };
  describe("Checking PropTypes", () => {
    test("Should NOT throw Warning/ Error", () => {
      const expectedInitialProps = props;
      const propsErr = checkProps(AgentDashboardTable, expectedInitialProps);
      expect(propsErr).toBeUndefined();
    });
  });

  describe("Renders Agent Dashboard Table Components", () => {
    let wrapper, store;
    beforeEach(() => {
      store = mockStore(props);
      wrapper = shallow(<AgentDashboardTable {...props} />);
    });

    test("Should Render Agents Dashboard Table Component without Errors", () => {
      const agentDashboardTableComp = findByTestId(wrapper, "agent-dashboard-table");
      expect(agentDashboardTableComp.length).toBe(1);
    });
  });
});
