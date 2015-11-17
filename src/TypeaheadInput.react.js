import React from 'react';

var {PropTypes} = React;

var TypeaheadInput = React.createClass({
  displayName: 'TypeaheadInput',

  propTypes: {
    selected: PropTypes.array
  },

  render: function() {
    var {selected, text} = this.props;
    var label = text || (selected && selected[0] && selected[0].label);

    return (
      <input
        {...this.props}
        className="form-control"
        type="text"
        value={label}
      />
    );
  }
});

module.exports = TypeaheadInput;
