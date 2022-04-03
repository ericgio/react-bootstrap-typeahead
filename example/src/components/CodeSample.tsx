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
  as?: React.ElementType;
  children: string;
  language?: string;
}

const CodeSample = ({
  as: Component = 'pre',
  children,
  language = 'jsx',
}: CodeSampleProps) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // @ts-ignore: Global
    const highlight = () => Prism.highlightElement(ref.current);

    highlight();
  }, [ref]);

  return (
    <Component className={`language-${language}`} ref={ref}>
      {getExampleCode(children)}
    </Component>
  );
};

export default CodeSample;
