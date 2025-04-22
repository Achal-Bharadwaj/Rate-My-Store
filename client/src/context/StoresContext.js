import React, { createContext, useState } from 'react';

export const StoresContext = createContext();

export const StoresProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const addStore = (store) => {
    setStores([...stores, store]);
  };

  return (
    <StoresContext.Provider value={{ stores, setStores, addStore, selectedStore, setSelectedStore }}>
      {children}
    </StoresContext.Provider>
  );
};