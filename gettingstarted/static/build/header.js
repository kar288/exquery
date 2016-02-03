'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doneFilters: false
    };
  }

  componentDidUpdate() {
    if (this.props.filters && !this.state.doneFilters) {
      $('.button-collapse').sideNav();
      this.setState({ doneFilters: true });
    }
  }

  render() {
    var buttonClasses = 'button-collapse';
    var filters = null;
    if (!this.props.filters) {
      buttonClasses += ' hidden';
    } else {
      filters = React.createElement(Filters, this.props);
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
          filters
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