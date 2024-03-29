import { createContext, useContext } from 'react';

const noop = () => {};

interface ExampleContextType {
  onAfter: (href: string) => void;
  onBefore: (href: string) => void;
}

const ExampleContext = createContext<ExampleContextType>({
  onAfter: noop,
  onBefore: noop,
});

export const useExampleContext = () => useContext(ExampleContext);

export default ExampleContext;
