'use strict';

class BookPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {overlay: false};
  }

  render() {
    var horizontalClass = this.props.horizontal ? 'horizontal' : '';
    var content = (
      <div
        className={'book-picture ' + horizontalClass}
        style={{backgroundImage: 'url(' + this.props.book.thumbnail + ')'}}
        onClick={this.props.onClick}
      />
    );
    return content;
  }
}
