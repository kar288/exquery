'use strict';

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {openFilter: null};
  }

  toggleSelectedFilter(filter) {
    this.setState({openFilter: filter});
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
        filterElements.push(
          <li key={'filter-' + field}>
            <a
              className='filter-element'
              href='#!'
              onClick={this.toggleSelectedFilter.bind(this, field)}>
              {field}
            </a>
            <i className='filter-nav-icon material-icons'>clear</i>
          </li>
        );
      } else if (this.state.openFilter === field) {
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
            <div>
              {values.map((val, i) => {
                return (
                  <div key={'val-' + i} >
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    });
    return (
      <div>
        <ul>
          {filterElements}
        </ul>
        {filterDetails}
        <a className='filter-add btn-floating btn-large waves-effect red'>
         <i className='material-icons'>add</i>
        </a>
      </div>
    );
  }
}
