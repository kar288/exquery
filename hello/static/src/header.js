'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {openFilter: null};
  }

  componentDidUpdate() {
    if (this.props.filters) {
      $('.button-collapse').sideNav();
    }
  }

  toggleSelectedFilter(filter) {
    this.setState({openFilter: filter});
  }

  render() {
    var filters = [
      'Publication Date',
      'Author',
      'Media Type',
      'Keywords',
      'Category',
    ];
    var filterDetails = [
      1990, 1991, 1992, 1993, 1994, 1995, 1996,
    ];
    var filterElements = [];
    var filterDetails = null;
    filters.forEach((filter, i) => {
      if (!this.state.openFilter) {
        filterElements.push(
          <li key={'filter-' + i}>
            <a
              className='filter-element'
              href='#!'
              onClick={this.toggleSelectedFilter.bind(this, filter)}>
              {filter}
            </a>
            <i className='filter-nav-icon material-icons'>clear</i>
          </li>
        );
      } else if (this.state.openFilter === filter) {
        filterDetails = (
          <div className='row filter-detail'>
            <div className='col-xs-2'>
              <i
                onClick={this.toggleSelectedFilter.bind(this, null)}
                className='filter-nav-icon material-icons'>
                ic_arrow_back
              </i>
            </div>
            <div className='col-xs-10'>
              {filter}
            </div>
          </div>
        );
      }
    });
    var filters = null;
    if (this.props.filters) {
      filters = (
        <div>
          <div id='slide-out' className='side-nav'>
            <ul>
              {filterElements}
            </ul>
            {filterDetails}
            <a className='filter-add btn-floating btn-large waves-effect red'>
             <i className='material-icons'>add</i>
            </a>
          </div>
          <a
            href='#'
            data-activates='slide-out'
            className='button-collapse'>
            <i className='mdi-navigation-menu' />
          </a>
        </div>
      );
    }
    return (
      <nav className='red' role='navigation'>
        <div className='nav-wrapper container'>
          <a id='logo-container' href='#' className='brand-logo'>
            ExQuery
          </a>
          {filters}
        </div>
      </nav>
    );
  }
}
