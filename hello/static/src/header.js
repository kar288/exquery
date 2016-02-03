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
    return (
      <nav className='red' role='navigation'>
        <div className='nav-wrapper container'>
          <a id='logo-container' href='#' className='brand-logo'>
            ExQuery
          </a>
          <div id='slide-out' className='side-nav'>
            <Filters {...this.props} />
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
