'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doneFilters: false,
    };
  }

  componentDidUpdate() {
    if (this.props.filters && !this.state.doneFilters) {
      $('.button-collapse').sideNav();
      this.setState({doneFilters: true});
    }
  }

  render() {
    var buttonClasses = 'button-collapse';
    var filters = null;
    if (!this.props.filters) {
      buttonClasses += ' hidden';
    } else {
      filters = <Filters {...this.props} />;
    }
    return (
      <nav className='red' role='navigation'>
        <div className='nav-wrapper container'>
          <a id='logo-container' href='#' className='brand-logo'>
            ExQuery
          </a>
          <div id='slide-out' className='side-nav'>
            {filters}
          </div>
          <a
            href='#'
            data-activates='slide-out'
            className={buttonClasses}>
            <i className='mdi-navigation-menu' />
          </a>
        </div>
      </nav>
    );
  }
}
