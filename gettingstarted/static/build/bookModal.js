'use strict';

class BookModal extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  render() {
    return React.createElement(
      "div",
      { className: "book-modal", onClick: this.props.onClick },
      React.createElement(
        "div",
        { className: "book-modal-content" },
        this.props.book.description
      )
    );
  }
}