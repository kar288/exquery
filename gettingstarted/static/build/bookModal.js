'use strict';

class BookModal extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var content = $('.book-modal-content');
    var image = $('.book-modal-image');
    image.width(content.width());
    image.height(content.height());
  }

  render() {
    return React.createElement(
      'div',
      { className: 'book-modal', onClick: this.props.onClick },
      React.createElement(
        'div',
        { className: 'book-modal-content' },
        React.createElement('div', {
          className: 'book-modal-image',
          style: { backgroundImage: 'url(' + this.props.book.Thumbnail + ')' }
        }),
        React.createElement(
          'div',
          { className: 'book-modal-info' },
          React.createElement(
            'h1',
            null,
            this.props.book.title
          ),
          React.createElement(
            'h5',
            null,
            this.props.book.author
          ),
          React.createElement(
            'div',
            { className: 'book-modal-description' },
            this.props.book.description
          )
        )
      )
    );
  }
}