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
        { label: `UPPERCASE ("upper")`, value: 'upper' },
        { label: `lowercase ("lower")`, value: 'lower' },
        { label: `Sentence case ("sentence")`, value: 'sentence' },
        { label: `Capitalise ("capitalise")`, value: 'capitalise' },
        { label: `AlTeRnAtInG ("alternate")`, value: 'alternate' },
        { label: `Title ("title")`, value: 'title' },
        { label: `camelCase ("camel")`, value: 'camel' },
        { label: `snake_case ("snake")`, value: 'snake' },
        { label: `Capital_Snake_Case ("snakeCapital")`, value: 'snakeCapitalised' },
        { label: `UPPER_SNAKE_CASE ("snakeUpper")`, value: 'snakeUpper' },
        { label: `Hyphenated-case ("hyphen")`, value: 'hyphen' },
        { label: `Capital-Hyphenated-Case ("hyphenCapitalised")`, value: 'hyphenCapitalised' },
        { label: `UPPER-HYPHENATED-CASE ("hyphenUpper")`, value: 'hyphenUpper' }
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
