'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.filters) {
      $('.button-collapse').sideNav();
    }
  }

  render() {
    var buttonClasses = 'button-collapse';
    if (!this.props.filters) {
      buttonClasses += ' hidden';
    }
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
          'div',
          { id: 'slide-out', className: 'side-nav' },
          React.createElement(Filters, this.props)
        ),
        React.createElement(
          'a',
          {
            href: '#',
            'data-activates': 'slide-out',
            className: buttonClasses },
          React.createElement('i', { className: 'mdi-navigation-menu' })
        )
      )
    );
  }
}