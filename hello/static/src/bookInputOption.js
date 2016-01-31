'use strict';

class BookInputOption extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {count: props.initialCount};
  }
  render() {
    return (
      <div className='row BookInputOption' onClick={this.props.onClick}>
        <div className='col s2'>
           <a className='btn-floating btn-large waves-effect waves-light red'>
            <i className='material-icons'>{this.props.icon}</i>
          </a>
        </div>
        <div className='col s10'>
          {this.props.text}
        </div>
      </div>
    );
  }
}
