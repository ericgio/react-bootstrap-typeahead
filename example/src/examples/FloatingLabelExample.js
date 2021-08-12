/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved,linebreak-style,indent,react/jsx-indent */

import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import options from '../data';

/* example-start */
const FloatingLabelExample = () => {
    const [singleFloatingSelections, setSingleFloatingSelections] = useState([]);
    const [multiFloatingSelections, setMultiFloatingSelections] = useState([]);

    return (
        <Fragment>
            <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Floating labels (single)</Form.Label>
                <Typeahead
                  id="basic-typeahead-single-floating-label"
                  inputProps={
                        {
                            floatingLabelText: 'Floating label',
                            id: 'basic-typeahead-single-floating-label-input',
                            useFloatingLabel: true,
                        }
                    }
                  labelKey="name"
                  options={options}
                  onChange={setSingleFloatingSelections}
                  placeholder="Choose a state..."
                  selected={singleFloatingSelections}
                />
            </Form.Group>
            <Form.Group style={{ marginTop: '20px' }}>
                <Form.Label>Floating labels (multiple)</Form.Label>
                <Typeahead
                  id="basic-typeahead-multiple-floating-label"
                  inputProps={
                        {
                            floatingLabelText: 'Floating label',
                            id: 'basic-typeahead-multiple-floating-label-input',
                            useFloatingLabel: true,
                        }
                    }
                  multiple
                  labelKey="name"
                  options={options}
                  onChange={setMultiFloatingSelections}
                  placeholder="Choose several states..."
                  selected={multiFloatingSelections}
                />
            </Form.Group>
        </Fragment>
);
};
/* example-end */

export default FloatingLabelExample;
