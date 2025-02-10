/* eslint-disable react/no-array-index-key */

import { groupBy } from 'lodash';
import React, { Fragment, useState } from 'react';
import { Form } from 'react-bootstrap';
import {
  Highlighter,
  Hint,
  Menu,
  MenuItem,
  Token,
  Typeahead,
  TypeaheadComponentProps,
} from 'react-bootstrap-typeahead';

import options, { Option } from '../data';

const RADIO_OPTIONS = [
  'Custom input',
  'Custom menu',
  'Custom menu item contents',
  'Custom token',
];

/* example-start */
const RenderingExample = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  const props: Partial<TypeaheadComponentProps> = {};

  switch (selectedOption) {
    case 0:
      props.renderInput = ({
        inputRef,
        referenceElementRef,
        value,
        ...inputProps
      }) => (
        <Hint>
          <Form.Control
            {...inputProps}
            ref={(node) => {
              inputRef(node);
              referenceElementRef(node);
            }}
          />
        </Hint>
      );
      break;
    case 1:
      props.renderMenu = (
        results,
        {
          newSelectionPrefix,
          onItemSelect,
          paginationText,
          renderMenuItemChildren,
          ...menuProps
        },
        state
      ) => {
        let index = 0;
        const regions = groupBy(results as Option[], 'region');
        const items = Object.keys(regions)
          .sort()
          .map((region) => (
            <Fragment key={region}>
              {index !== 0 && <Menu.Divider />}
              <Menu.Header>{region}</Menu.Header>
              {regions[region].map((i) => {
                const item = (
                  <MenuItem
                    key={index}
                    onClick={() => onItemSelect(i)}
                    option={i}
                    position={index}>
                    <Highlighter search={state.text}>{i.name}</Highlighter>
                  </MenuItem>
                );

                index += 1;
                return item;
              })}
            </Fragment>
          ));

        return <Menu {...menuProps}>{items}</Menu>;
      };
      break;
    case 2:
      props.renderMenuItemChildren = (option, { text }) => (
        <>
          <Highlighter search={text}>{option.name}</Highlighter>,
          <div>
            <small>Population: {option.population.toLocaleString()}</small>
          </div>
        </>
      );
      break;
    case 3:
      props.multiple = true;
      props.renderToken = (option, { onRemove }, index: number) => (
        <Token key={index} onRemove={onRemove} option={option}>
          {`${option.name} (Pop: ${option.population.toLocaleString()})`}
        </Token>
      );
      break;
    default:
      break;
  }

  return (
    <>
      <Typeahead
        {...props}
        id="rendering-example"
        labelKey="name"
        options={options}
        placeholder="Choose a state..."
      />
      <Form.Group className="mt-3">
        {RADIO_OPTIONS.map((label, idx) => (
          <Form.Check
            checked={selectedOption === idx}
            id={`rendering-${idx}`}
            key={idx}
            label={label}
            onChange={() => setSelectedOption(idx)}
            type="radio"
          />
        ))}
      </Form.Group>
    </>
  );
};
/* example-end */

export default RenderingExample;
