import React, { createContext, useState, useContext } from 'react';

interface AppStateValue {
  cart: {
    items: { id: number; name: string; price: number; quantity: number }[];
  };
}

const defaultStateValue: AppStateValue = {
  cart: {
    items: [],
  },
};

export const AppStateContext = createContext(defaultStateValue);

const AppStateProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(defaultStateValue);
  return (
    <AppStateContext.Provider value={state}>
        {children}
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
