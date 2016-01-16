'use strict';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
  }
  tick() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return React.createElement(
      'div',
      { onClick: this.tick.bind(this) },
      'Clicks: ',
      this.state.count
    );
  }
}
Counter.propTypes = { initialCount: React.PropTypes.number };
Counter.defaultProps = { initialCount: 0 };