'use strict';

class BookPicture extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  showDetails() {
    console.log(this.props.title);
    console.log(this.props.author);
    console.log(this.props.description);
  }

  render() {
    return (
      <img src={this.props.img} onClick={this.showDetails}>
    );
  }
}
