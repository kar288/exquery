'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openFilter: null };
  }

  componentDidMount() {
    $(".button-collapse").sideNav();
  }

  toggleSelectedFilter(filter) {
    this.setState({ openFilter: filter });
  }

  render() {
    var filters = ['Publication Date', 'Author', 'Media Type', 'Keywords', 'Category'];
    var filterDetails = [1990, 1991, 1992, 1993, 1994, 1995, 1996];
    var filterElements = [];
    var filterDetails = null;
    filters.forEach((filter, i) => {
      if (!this.state.openFilter) {
        filterElements.push(React.createElement(
          'li',
          { key: 'filter-' + i },
          React.createElement(
            'a',
            {
              className: 'filter-element',
              href: '#!',
              onClick: this.toggleSelectedFilter.bind(this, filter) },
            filter
          ),
          React.createElement(
            'i',
            { className: 'filter-nav-icon material-icons' },
            'clear'
          )
        ));
      } else if (this.state.openFilter === filter) {
        filterDetails = React.createElement(
          'div',
          { className: 'row filter-detail' },
          React.createElement(
            'div',
            { className: 'col-xs-2' },
            React.createElement(
              'i',
              {
                onClick: this.toggleSelectedFilter.bind(this, null),
                className: 'filter-nav-icon material-icons' },
              'ic_arrow_back'
            )
          ),
          React.createElement(
            'div',
            { className: 'col-xs-10' },
            filter
          )
        );
      }
    });
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
          React.createElement(
            'ul',
            null,
            filterElements
          ),
          filterDetails,
          React.createElement(
            'a',
            { className: 'filter-add btn-floating btn-large waves-effect waves-light red' },
            React.createElement(
              'i',
              { className: 'material-icons' },
              'add'
            )
          )
        ),
        React.createElement(
          'a',
          { href: '#', 'data-activates': 'slide-out', className: 'button-collapse' },
          React.createElement('i', { className: 'mdi-navigation-menu' })
        )
      )
    );
  }
}