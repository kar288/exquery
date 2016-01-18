'use strict';

class BookModal extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  render() {
    return (
      <div className="book-modal" onClick={this.props.onClick}>
        <div className="book-modal-content">
          {this.props.book.description}
        </div>
      </div>
    );
  }
}
