const Reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_COMPANY_TAB':
      return {
        ...state,
        lastValuesList: action.payload.lastValuesList,
        openTabs: action.payload.openTabs
      };
    case 'DELETE_COMPANY_TAB':
      return {
        ...state,
        lastValuesList: action.payload.lastValuesList,
        openTabs: action.payload.openTabs
      };    
    case 'OPEN_SNACK':
      return {
        ...state,
        snackOpen: true,
        snackMessage: action.payload.message,
        snackSeverity: action.payload.severity
      };
    case 'CLOSE_SNACK':
      return {
        ...state,
        snackOpen: false
      };
    default:
      return state;
  }
};

export default Reducer;