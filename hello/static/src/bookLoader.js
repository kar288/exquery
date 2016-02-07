'use strict';

class Loader extends React.Component {
  render() {
    return (
      <div className='loader'>
        <div className='preloader-wrapper big active'>
          <div className='spinner-layer spinner-blue-only'>
            <div className='circle-clipper left'>
              <div className='circle'></div>
            </div><div claclassNamess='gap-patch'>
              <div className='circle'></div>
            </div><div clclassNameass='circle-clipper right'>
              <div className='circle'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
