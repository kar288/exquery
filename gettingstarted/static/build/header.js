'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }
  collapse() {
    $('.button-collapse').sideNav();
  }
  render() {
    return React.createElement(
      'nav',
      { className: 'red', role: 'navigation' },
      React.createElement(
        'div',
        { className: 'nav-wrapper container' },
        React.createElement(
          'a',
          { id: 'logo-container', href: '#', className: 'brand-logo' },
          'ExQuery'
        ),
        React.createElement(
          'a',
          { href: '#',
            'data-activates': 'nav-mobile',
            className: 'button-collapse',
            onClick: this.collapse },
          React.createElement(
            'i',
            { className: 'material-icons' },
            'menu'
          )
        ),
        React.createElement(
          'ul',
          { className: 'right' },
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              { href: '#' },
              React.createElement(
                'i',
                { className: 'material-icons' },
                'search'
              )
            )
          )
        )
      )
    );
  }
}