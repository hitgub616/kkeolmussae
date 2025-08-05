import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [stock, setStock] = useState(null);
  const [date, setDate] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <AppContext.Provider value={{
      stock,
      setStock,
      date,
      setDate,
      result,
      setResult
    }}>
      {children}
    </AppContext.Provider>
  );
}; 