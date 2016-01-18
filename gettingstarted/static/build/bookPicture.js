'use strict';

class BookPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = { overlay: false };
  }

  toggleDetails() {
    console.log(this.props.book.title);
    console.log(this.props.book.author);
    console.log(this.props.book.description);
    // this.setState({overlay: !this.state.overlay});
  }

  render() {
    var content = React.createElement('div', {
      className: 'book-picture',
      style: { backgroundImage: 'url(' + this.props.book.image + ')' },
      onClick: this.props.onClick
    });
    // if (this.state.overlay) {
    //   content = (
    //     <div className="book-overlay" onClick={this.toggleDetails.bind(this)} >
    //       {this.props.book.description}
    //     </div>
    //   );
    // }
    return content;
  }
}