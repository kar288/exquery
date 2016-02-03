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
    return (
      <div className='book-modal' onClick={this.props.onClick}>
        <div className='book-modal-content'>
          <div
            className='book-modal-image'
            style={{backgroundImage: 'url(' + this.props.book.Thumbnail + ')'}}
          />
          <div className='book-modal-info'>
            <h1>
              {this.props.book.title}
            </h1>
            <h5>
              {this.props.book.author}
            </h5>
            <div className='book-modal-description'>
              {this.props.book.description}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
