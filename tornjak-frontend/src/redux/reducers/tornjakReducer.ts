import {
    GLOBAL_MESSAGE,
    GLOBAL_CLICKED_DASHBOARD_TABLE,
    GLOBAL_ENV_ARGUMENTS,
    TornjakReducerState,
    TornjakAction,
} from '../actions/types';

const initialState: TornjakReducerState = {
    globalErrorMessage: "",
    globalClickedDashboardTable: "",
    globalEnvArguments: {
        REACT_APP_AUTH_SERVER_URI: "",
        REACT_APP_API_SERVER_URI: "",
        REACT_APP_SPIRE_HEALTH_CHECK_ENABLE: false,
        environment: "DEV", 
    }
};

export default function tornjakReducer(state: TornjakReducerState = initialState, action: TornjakAction) {
    switch (action.type) {
        case GLOBAL_MESSAGE:
            return {
                ...state,
                globalErrorMessage: action.payload
            };
        case GLOBAL_CLICKED_DASHBOARD_TABLE:
            return {
                ...state,
                globalClickedDashboardTable: action.payload
            };
        case GLOBAL_ENV_ARGUMENTS:
            return {
                ...state,
                globalEnvArguments: action.payload
            };
        default:
            return state;
    }
}