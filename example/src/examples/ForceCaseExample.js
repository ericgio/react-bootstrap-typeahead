/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */

import React, {Fragment, useState, useRef} from 'react';
import {Form} from 'react-bootstrap';
import {Typeahead} from 'react-bootstrap-typeahead';

import options from '../data';
import {setCase} from "../../../src/utils";
let forceCaseKey = 0;

/* example-start */
const ForceCaseExample = () => {
    const [forceCaseSelection, setForceCaseSelection] = useState("upper");
    const [forceCaseValue, setForceCaseValue] = useState("");
    const ref = useRef();
    const forceCaseRadios = [
        { label: `Uppercase ("upper")`, value: 'upper' },
        { label: `Lowercase ("lower")`, value: 'lower' },
        { label: `Sentence case ("sentence")`, value: 'sentence' },
        { label: `Capitalise ("capitalise")`, value: 'capitalise' },
        { label: `Alternating ("alternate")`, value: 'alternate' },
        { label: `Title ("alternate")`, value: 'title' }
    ];
    return (
        <Fragment>
                <Typeahead
                    id="basic-typeahead-single"
                    labelKey="name"
                    options={options}
                    placeholder="Choose a state..."
                    forceCase={forceCaseSelection}
                    allowNew={true}
                    ref={ref}
                    defaultInputValue={forceCaseValue}
                    key={forceCaseKey}
                />
                <Form.Group>
                    {forceCaseRadios.map(({ label, value }) => {
                        return(
                            <Form.Check
                                checked={forceCaseSelection === value}
                                id={`input-size-${label}`}
                                key={value || 'default'}
                                label={label}
                                onChange={ () => {
                                    //set new case type
                                    setForceCaseSelection(value);
                                    //set input state value with new case style
                                    setForceCaseValue(setCase(ref.current.getInput().value, value));
                                    //update key to force input to re-render and reflect show new style
                                    forceCaseKey++;
                                }}
                                type="radio"
                                value={value}
                            />
                        )
                    })}
            </Form.Group>
        </Fragment>
    );
};
/* example-end */

export default ForceCaseExample;
