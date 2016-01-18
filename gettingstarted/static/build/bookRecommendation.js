'use strict';

class BookRecommendation extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(BookPicture, this.props),
      React.createElement(
        "div",
        { className: "switch" },
        React.createElement(
          "label",
          null,
          React.createElement("input", { type: "checkbox" }),
          React.createElement("span", { className: "lever" })
        )
      )
    );
  }
}