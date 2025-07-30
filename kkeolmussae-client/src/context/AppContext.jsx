import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState('home');
  const [stock, setStock] = useState(null); // {name, ticker}
  const [date, setDate] = useState(null); // 'YYYY-MM-DD'
  const [result, setResult] = useState(null); // number
  return (
    <AppContext.Provider value={{ page, setPage, stock, setStock, date, setDate, result, setResult }}>
      {children}
    </AppContext.Provider>
  );
}; 