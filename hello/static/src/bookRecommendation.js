'use strict';

class BookRecommendation extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  render() {
    return (
      <BookPicture {...this.props}>
      <div className="switch">
        <label>
          Off
          <input type="checkbox">
          <span className="lever"></span>
          On
        </label>
      </div>
    );
  }
}
