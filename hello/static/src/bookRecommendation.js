'use strict';

class BookRecommendation extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }

  render() {
    return (
      <div>
        <BookPicture {...this.props} />
        <div className="switch">
          <label>
            <input type="checkbox"/>
            <span className="lever"></span>
          </label>
        </div>
      </div>
    );
  }
}
