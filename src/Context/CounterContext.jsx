import { createContext, useState } from "react";

export const CounterContext = createContext();

export default function CounterProvider({ children }) {
  const [counter, setCounter] = useState(0);

  function increment() {
    setCounter(prev => prev + 1);
  }

  function decrement() {
    setCounter(prev => prev - 1);
  }

  return (
    <CounterContext.Provider value={{ counter, increment, decrement }}>
      {children}
    </CounterContext.Provider>
  );
}
