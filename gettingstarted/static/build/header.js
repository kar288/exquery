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
    return React.createElement(
      "nav",
      { className: "red", role: "navigation" },
      React.createElement(
        "div",
        { className: "nav-wrapper container" },
        React.createElement(
          "a",
          { id: "logo-container", href: "#", className: "brand-logo" },
          "ExQuery"
        ),
        React.createElement(
          "ul",
          { id: "slide-out", className: "side-nav" },
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#!" },
              "First Sidebar Link"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#!" },
              "Second Sidebar Link"
            )
          ),
          React.createElement(
            "li",
            { className: "no-padding" },
            React.createElement(
              "ul",
              { className: "collapsible collapsible-accordion" },
              React.createElement(
                "li",
                null,
                React.createElement(
                  "a",
                  { className: "collapsible-header" },
                  "Dropdown",
                  React.createElement("i", { className: "mdi-navigation-arrow-drop-down" })
                ),
                React.createElement(
                  "div",
                  { className: "collapsible-body" },
                  React.createElement(
                    "ul",
                    null,
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { href: "#!" },
                        "First"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { href: "#!" },
                        "Second"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { href: "#!" },
                        "Third"
                      )
                    ),
                    React.createElement(
                      "li",
                      null,
                      React.createElement(
                        "a",
                        { href: "#!" },
                        "Fourth"
                      )
                    )
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          "ul",
          { className: "right hide-on-med-and-down" },
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#!" },
              "First Sidebar Link"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#!" },
              "Second Sidebar Link"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { className: "dropdown-button", href: "#!", "data-activates": "dropdown1" },
              "Dropdown",
              React.createElement("i", { className: "mdi-navigation-arrow-drop-down right" })
            )
          ),
          React.createElement(
            "ul",
            { id: "dropdown1", className: "dropdown-content" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { href: "#!" },
                "First"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { href: "#!" },
                "Second"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { href: "#!" },
                "Third"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { href: "#!" },
                "Fourth"
              )
            )
          )
        ),
        React.createElement(
          "a",
          { href: "#", "data-activates": "slide-out", className: "button-collapse" },
          React.createElement("i", { className: "mdi-navigation-menu" })
        )
      )
    );
  }
}