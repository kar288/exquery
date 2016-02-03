'use strict';

const BAD_FIELDS = {
  'Title': true,
  'ISBN': true,
  'Description': true,
  'Thumbnail': true,
  'Author': false,
  'Category': false,
  'Year': false,
  'Media Type': false,
  'Keywords': false
};

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openFilter: null,
      filters: this.props.filters || new Map(),
      addFilter: false
    };
  }

  toggleSelectedFilter(filter) {
    if (this.state.addFilter) {
      return;
    }
    this.setState({ openFilter: filter });
  }

  toggleAddFilter() {
    this.setState({ addFilter: !this.state.addFilter });
  }

  toggleFilter(field) {
    var filters = this.state.filters;
    var filterVals = filters.get(field);
    filterVals.on = !filterVals.on;
    filters.set(field, filterVals);
    this.setState({
      openFilter: null,
      filters: filters
    });
  }

  render() {
    var filters = this.state.filters;
    if (filters.size <= 0) {
      return null;
    }
    var filterElements = [];
    var filterDetails = null;
    filters.forEach((values, field) => {
      if (BAD_FIELDS[field]) {
        return;
      }
      if (!this.state.openFilter) {
        if (this.state.addFilter ^ values.on) {
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
              { onClick: this.toggleFilter.bind(this, field),
                className: 'filter-nav-icon material-icons' },
              values.on ? 'clear' : 'add'
            )
          ));
        }
      } else if (this.state.openFilter === field) {
        var filterVals = [];
        values.vals.forEach((val, i) => {
          filterVals.push(React.createElement(
            'div',
            { key: 'val-' + i },
            React.createElement('input', {
              type: 'checkbox',
              className: 'filled-in',
              id: 'box-' + i,
              defaultChecked: true
            }),
            React.createElement(
              'label',
              { htmlFor: 'box-' + i },
              val
            )
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
            { className: 'filter-values' },
            filterVals
          )
        );
      }
    });
    var title = React.createElement(
      'h5',
      null,
      'Manage filters:'
    );
    var addIcon = React.createElement(
      'a',
      { className: 'filter-add btn-floating btn-large waves-effect red' },
      React.createElement(
        'i',
        { onClick: this.toggleAddFilter.bind(this),
          className: 'material-icons' },
        'add'
      )
    );
    if (this.state.addFilter) {
      title = React.createElement(
        'div',
        { className: 'row filter-detail' },
        React.createElement(
          'div',
          { className: 'col s2' },
          React.createElement(
            'i',
            {
              onClick: this.toggleAddFilter.bind(this),
              className: 'filter-nav-icon material-icons' },
            'ic_arrow_back'
          )
        ),
        React.createElement(
          'div',
          { className: 'col s10' },
          'Add fields'
        )
      );
      var addIcon = null;
    }
    return React.createElement(
      'div',
      null,
      title,
      React.createElement(
        'ul',
        null,
        filterElements
      ),
      filterDetails,
      addIcon
    );
  }
}