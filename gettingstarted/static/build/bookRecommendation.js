'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class BookRecommendation extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(BookPicture, _extends({}, this.props, { horizontal: true })),
      React.createElement(
        'div',
        { className: 'switch' },
        React.createElement(
          'label',
          null,
          React.createElement('input', { type: 'checkbox' }),
          React.createElement('span', { className: 'lever' })
        )
      )
    );
  }
}