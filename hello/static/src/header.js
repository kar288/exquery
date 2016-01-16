'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }
  collapse() {
    $('.button-collapse').sideNav();
  }
  render() {
    return (
      <nav className="red lighten-1" role="navigation">
        <div className="nav-wrapper container">
          <a id="logo-container" href="#" className="brand-logo">
            ExQuery
          </a>
          <a href="#"
            data-activates="nav-mobile"
            className="button-collapse"
            onClick={this.collapse}>
            <i className="material-icons">menu</i>
          </a>

          <ul className="right">
            <li><a href="#"><i className="material-icons">search</i></a></li>
          </ul>
        </div>
      </nav>
    );
  }
}
