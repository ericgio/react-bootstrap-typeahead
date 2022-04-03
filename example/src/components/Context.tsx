import { createContext, useContext } from 'react';

const noop = () => {}; // eslint-disable-line

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
