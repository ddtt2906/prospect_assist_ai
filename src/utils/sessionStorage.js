export const loadState = (key, defaultState) => {
  try {
    const serializedState = sessionStorage.getItem(key);
    if (serializedState === null) {
      return defaultState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultState;
  }
};

export const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem(key, serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

export const clearState = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    // Ignore remove errors
  }
};
