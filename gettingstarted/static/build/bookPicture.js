'use strict';

class BookPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = { overlay: false };
  }

  render() {
    var horizontalClass = this.props.horizontal ? 'horizontal' : '';
    var content = React.createElement('div', {
      className: 'book-picture z-depth-1 ' + horizontalClass,
      style: { backgroundImage: 'url(' + this.props.book.Thumbnail + ')' },
      onClick: this.props.onClick
    });
    return content;
  }
}