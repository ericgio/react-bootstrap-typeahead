import Prism from 'prismjs';
import React, { useEffect, useRef } from 'react';

const START_STR = '/* example-start */';
const END_STR = '/* example-end */';

function getExampleCode(str: string) {
  return str.slice(
    str.indexOf(START_STR) + START_STR.length + 1,
    str.indexOf(END_STR)
  );
}

interface CodeSampleProps {
  children: string;
}

const CodeSample = ({ children }: CodeSampleProps) => {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, []);

  return (
    <pre className="language-jsx" ref={ref}>
      {getExampleCode(children)}
    </pre>
  );
};

export default CodeSample;
