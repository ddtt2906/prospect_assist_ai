export const initialState = {
  selectedCustomerId: "CUST-1007", // Default to Riya
  events: [],
  connectedSources: {
    clickstream: true,
    coreBanking: true,
    accountAggregator: false,
    creditProfile: true
  },
  consent: null,
  transactions: [],
  transactionClassifications: [],
  engineeredFeatures: null,
  agentRuns: {},
  finalDecision: null,
  rmActions: [],
  feedbackOutcome: null,
  tourState: { run: false, stepIndex: 0 },
  aiMode: "Live Groq",
  groqModel: "llama-3.3-70b-versatile"
};

export function demoReducer(state, action) {
  switch (action.type) {
    case 'SET_CUSTOMER':
      return { 
        ...initialState, 
        selectedCustomerId: action.payload,
        // Persist some global settings across customer changes
        aiMode: state.aiMode,
        groqModel: state.groqModel,
        tourState: state.tourState
      };
      
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
      
    case 'CLEAR_EVENTS':
      return { ...state, events: [] };
      
    case 'UPDATE_CONNECTION':
      return {
        ...state,
        connectedSources: {
          ...state.connectedSources,
          [action.payload.source]: action.payload.status
        }
      };
      
    case 'SET_CONSENT':
      return { ...state, consent: action.payload };
      
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
      
    case 'SET_CLASSIFICATIONS':
      return { ...state, transactionClassifications: action.payload };
      
    case 'SET_ENGINEERED_FEATURES':
      return { ...state, engineeredFeatures: action.payload };
      
    case 'SET_AGENT_RUN':
      return { 
        ...state, 
        agentRuns: {
          ...state.agentRuns,
          [action.payload.agentId]: action.payload.data
        }
      };
      
    case 'SET_FINAL_DECISION':
      return { ...state, finalDecision: action.payload };
      
    case 'ADD_RM_ACTION':
      return { ...state, rmActions: [...state.rmActions, action.payload] };
      
    case 'SET_FEEDBACK':
      return { ...state, feedbackOutcome: action.payload };
      
    case 'UPDATE_TOUR':
      return { ...state, tourState: { ...state.tourState, ...action.payload } };
      
    case 'SET_AI_MODE':
      return { ...state, aiMode: action.payload };
      
    case 'SET_GROQ_MODEL':
      return { ...state, groqModel: action.payload };
      
    case 'RESET_DEMO':
      return {
        ...initialState,
        selectedCustomerId: state.selectedCustomerId,
        aiMode: state.aiMode,
        groqModel: state.groqModel,
        tourState: state.tourState
      };
      
    default:
      return state;
  }
}
