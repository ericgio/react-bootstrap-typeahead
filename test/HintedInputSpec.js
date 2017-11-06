import {expect} from 'chai';
import {head, noop} from 'lodash';
import * as React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import HintedInput from '../src/HintedInput';

const baseProps = {
  onChange: noop,
  value: '',
};

function renderInput(props) {
  return ReactTestUtils.renderIntoDocument(<HintedInput {...props} />);
}

function findInputNode(instance) {
  return ReactTestUtils.findRenderedDOMComponentWithClass(
    instance,
    'rbt-input-main'
  );
}

function findHintNode(instance) {
  const nodes = ReactTestUtils.scryRenderedDOMComponentsWithClass(
    instance,
    'rbt-input-hint'
  );
  return head(nodes);
}

describe('<HintedInput>', () => {

  it('renders a hinted input', () => {
    const instance = renderInput(baseProps);

    const inputNode = findInputNode(instance);
    const hintNode = findHintNode(instance);

    expect(inputNode).to.exist;
    expect(hintNode).to.exist;
  });

  it('does not render the hint in multi-select mode', () => {
    const instance = renderInput({...baseProps, multiple: true});

    const hintNode = findHintNode(instance);

    expect(hintNode).to.equal(undefined);
  });

});
