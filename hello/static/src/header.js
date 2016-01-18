'use strict';

class Header extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }
  componentDidMount() {
    $(".button-collapse").sideNav();
  }
  render() {
    return (
      <nav className="red" role="navigation">
        <div className="nav-wrapper container">
          <a id="logo-container" href="#" className="brand-logo">
            ExQuery
          </a>
          <ul id="slide-out" className="side-nav">
            <li><a href="#!">First Sidebar Link</a></li>
            <li><a href="#!">Second Sidebar Link</a></li>
            <li className="no-padding">
              <ul className="collapsible collapsible-accordion">
                <li>
                  <a className="collapsible-header">Dropdown<i className="mdi-navigation-arrow-drop-down"></i></a>
                  <div className="collapsible-body">
                    <ul>
                      <li><a href="#!">First</a></li>
                      <li><a href="#!">Second</a></li>
                      <li><a href="#!">Third</a></li>
                      <li><a href="#!">Fourth</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="right hide-on-med-and-down">
            <li><a href="#!">First Sidebar Link</a></li>
            <li><a href="#!">Second Sidebar Link</a></li>
            <li><a className="dropdown-button" href="#!" data-activates="dropdown1">Dropdown<i className="mdi-navigation-arrow-drop-down right"></i></a></li>
            <ul id='dropdown1' className='dropdown-content'>
              <li><a href="#!">First</a></li>
              <li><a href="#!">Second</a></li>
              <li><a href="#!">Third</a></li>
              <li><a href="#!">Fourth</a></li>
            </ul>
          </ul>
          <a href="#" data-activates="slide-out" className="button-collapse"><i className="mdi-navigation-menu"></i></a>

        </div>
      </nav>
    );
  }
}
