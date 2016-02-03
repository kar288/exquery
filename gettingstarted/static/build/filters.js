'use strict';

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openFilter: null };
  }

  toggleSelectedFilter(filter) {
    this.setState({ openFilter: filter });
  }

  render() {
    var filters = this.props.filters || new Map();
    if (filters.size <= 0) {
      return null;
    }
    var filterElements = [];
    var filterDetails = null;
    filters.forEach((values, field) => {
      if (!this.state.openFilter) {
        filterElements.push(React.createElement(
          'li',
          { key: 'filter-' + field },
          React.createElement(
            'a',
            {
              className: 'filter-element',
              href: '#!',
              onClick: this.toggleSelectedFilter.bind(this, field) },
            field
          ),
          React.createElement(
            'i',
            { className: 'filter-nav-icon material-icons' },
            'clear'
          )
        ));
      } else if (this.state.openFilter === field) {
        var filterVals = [];
        values.forEach((val, i) => {
          filterVals.push(React.createElement(
            'div',
            { key: 'val-' + i },
            val
          ));
        });
        filterDetails = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'row filter-detail' },
            React.createElement(
              'div',
              { className: 'col s2' },
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
              { className: 'col s10' },
              field
            )
          ),
          React.createElement(
            'div',
            null,
            filterVals
          )
        );
      }
    });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'ul',
        null,
        filterElements
      ),
      filterDetails,
      React.createElement(
        'a',
        { className: 'filter-add btn-floating btn-large waves-effect red' },
        React.createElement(
          'i',
          { className: 'material-icons' },
          'add'
        )
      )
    );
  }
}