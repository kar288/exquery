'use strict';

class Loader extends React.Component {
  render() {
    return React.createElement(
      'div',
      { className: 'loader' },
      React.createElement(
        'div',
        { className: 'preloader-wrapper big active' },
        React.createElement(
          'div',
          { className: 'spinner-layer spinner-blue-only' },
          React.createElement(
            'div',
            { className: 'circle-clipper left' },
            React.createElement('div', { className: 'circle' })
          ),
          React.createElement(
            'div',
            { claclassNamess: 'gap-patch' },
            React.createElement('div', { className: 'circle' })
          ),
          React.createElement(
            'div',
            { clclassNameass: 'circle-clipper right' },
            React.createElement('div', { className: 'circle' })
          )
        )
      )
    );
  }
}