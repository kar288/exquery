'use strict';

class BookInputOption extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }
  render() {
    return React.createElement(
      "div",
      { className: "row something BookInputOption", onClick: this.props.onClick },
      React.createElement(
        "div",
        { className: "col-xs-2" },
        React.createElement(
          "a",
          { className: "btn-floating btn-large waves-effect waves-light red" },
          React.createElement(
            "i",
            { className: "material-icons" },
            this.props.icon
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-xs-10" },
        this.props.text
      )
    );
  }
}