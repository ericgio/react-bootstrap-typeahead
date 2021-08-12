// @flow

import React from 'react';

import Hint, {type ShouldSelect} from './Hint';
import Input from './Input';

import withClassNames from '../behaviors/classNames';

import type {RefCallback, ReferenceElement} from '../types';

type Props = {
    inputRef: RefCallback<HTMLInputElement>,
    referenceElementRef: RefCallback<ReferenceElement>,
    shouldSelectHint?: ShouldSelect,
};

export default withClassNames(({
                                   inputRef,
                                   referenceElementRef,
                                   shouldSelectHint,
                                   ...props
                               }: Props) => {
    const useFloatingLabel = props.useFloatingLabel;
    const floatingLabelText = props.floatingLabelText || props.placeholder || null;
    props.placeholder = props.placeholder || props.floatingLabelText || null;
    delete props.useFloatingLabel;
    delete props.floatingLabelText;
    return (<Hint shouldSelect={shouldSelectHint}>
            <div className={`w-100 ${useFloatingLabel ? "form-floating" : ""}`}>
                <Input
                    {...props}
                    ref={(node) => {
                        inputRef(node);
                        referenceElementRef(node);
                    }}
                />
                {useFloatingLabel && <label htmlFor={props.id}>{floatingLabelText}</label>}
            </div>
        </Hint>
    )
});
