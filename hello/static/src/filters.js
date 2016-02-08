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
  'Keywords': false,
};

class Filters extends React.Component {
  constructor(props) {
    super(props);
    var metadata = new Map();
    var results = this.props.filters;
    results.forEach((result, i) => {
      var keys = Object.keys(result);
      keys.forEach(key => {
        var vals = metadata.get(key) || new Map();
        var els = result[key];
        if (!Array.isArray(els)) {
          els = [els];
        }
        els.forEach(el => {
          var obj = vals[el] || {on: true, books: []};
          obj.books.push(i);
          vals.set(el, obj);
        });
        metadata.set(key, vals);
      });
    });
    var newMetadata = new Map();
    metadata.forEach((val, key) => {
      var k = key.split('-')[0];
      newMetadata.set(k, {vals: val, on: true});
    });
    this.state = {
      openFilter: null,
      filters: newMetadata,
      addFilter: false,
    };
  }

  toggleSelectedFilter(filter) {
    if (this.state.addFilter) {
      return;
    }
    this.setState({openFilter: filter});
  }

  toggleAddFilter() {
    this.setState({addFilter: !this.state.addFilter});
  }

  onDisableFilterItem(field, el, e) {
    e.preventDefault();
    var books = el.books;
    var name = el.name;
    this.props.onDisableFilterItem(books, e.target.checked ? 1 : -1);
    var filters = this.state.filters;
    var on = filters.get(field).vals.get(el.name).on;
    filters.get(field).vals.get(el.name).on = !on;
    return false;
  }

  toggleFilter(field) {
    var filters = this.state.filters;
    var filterVals = filters.get(field);
    filterVals.on = !filterVals.on;
    filters.set(field, filterVals);
    this.setState({
      openFilter: null,
      filters: filters,
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
          filterElements.push(
            <li key={'filter-' + field}>
              <a
                className='filter-element'
                href='#!'
                onClick={this.toggleSelectedFilter.bind(this, field)}>
                {field}
              </a>
              <i onClick={this.toggleFilter.bind(this, field)}
                className='filter-nav-icon material-icons'>
                {values.on ? 'clear' : 'add'}
              </i>
            </li>
          );
        }
      } else if (this.state.openFilter === field) {
        var filterVals = [];
        var els = [];
        values.vals.forEach((val, key, i) => {
          els.push(Object.assign(val, {name: key}));
        });
        els.sort(function(a, b) {
          if (field === 'Year') {
            return parseInt(a.name) > parseInt(b.name);
          } else {
            return a.books.length > b.books.length;
          }
        });
        els.forEach((el, i) => {
          var input = (
            <div key={'val-' + i}>
              <input
                type='checkbox'
                className='filled-in'
                id={'box-' + i}
                onClick={this.onDisableFilterItem.bind(this, field, el)}
              />
              <label htmlFor={'box-' + i}>{el.name}</label>
            </div>
          );
          if (el.on) {
            input = (
              <div key={'val-' + i}>
                <input
                  type='checkbox'
                  className='filled-in'
                  id={'box-' + i}
                  onClick={this.onDisableFilterItem.bind(this, field, el)}
                  defaultChecked
                />
                <label htmlFor={'box-' + i}>{el.name}</label>
              </div>
            );
          }
          filterVals.push(input);
        });
        filterDetails = (
          <div>
            <div className='row filter-detail'>
              <div className='col s2'>
                <i
                  onClick={this.toggleSelectedFilter.bind(this, null)}
                  className='filter-nav-icon material-icons'>
                  ic_arrow_back
                </i>
              </div>
              <div className='col s10'>
                {field}
              </div>
            </div>
            <div className='filter-values'>
              {filterVals}
            </div>
          </div>
        );
      }
    });
    var title = <h5>Manage filters:</h5>;
    var addIcon = (
      <a className='filter-add btn-floating btn-large waves-effect red'>
       <i onClick={this.toggleAddFilter.bind(this)}
         className='material-icons'>
         add
       </i>
      </a>
    );
    if (this.state.addFilter) {
      title = (
        <div className='row filter-detail'>
          <div className='col s2'>
            <i
              onClick={this.toggleAddFilter.bind(this)}
              className='filter-nav-icon material-icons'>
              ic_arrow_back
            </i>
          </div>
          <div className='col s10'>
            Add fields
          </div>
        </div>
      );
      var addIcon = null;
    }
    return (
      <div>
        {title}
        <ul>
          {filterElements}
        </ul>
        {filterDetails}
        {addIcon}
      </div>
    );
  }
}
