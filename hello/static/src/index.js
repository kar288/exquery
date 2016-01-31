'use strict';

const steps = {
  'inputType': 0,
  'input': 1,
  'confirmation': 2,
  'recommendations': 3,
  'results': 4
};

var recommendedSamples = [
  {
    title: 'Sellevision',
    author: 'Augusten Burroughs',
    description: 'Sellevision a novel is the first work published by Augusten Burroughs, author of the best-selling books Running with Scissors, Dry, and Magical Thinking. Unlike Burroughs’ subsequent memoirs, Sellevision is a work of fiction.',
    year: 2000,
    genre: 'novel',
    image: 'http://t2.gstatic.com/images?q=tbn:ANd9GcQfUY4XR6yDsV-vNwsS6rN447724qTUnyIEbmtYfBBgGCUxlr7_',
  }, {
    title: 'Sellevision2',
    author: 'Augusten Burroughs',
    description: 'Sellevision a novel is the first work published by Augusten Burroughs, author of the best-selling books Running with Scissors, Dry, and Magical Thinking. Unlike Burroughs’ subsequent memoirs, Sellevision is a work of fiction.',
    year: 2000,
    genre: 'novel',
    image: 'http://t1.gstatic.com/images?q=tbn:ANd9GcSsKj2GXtKAEp_eIeVY-PnLNuHOa2KvHR0TbyAfeeFu_vGXXK0T'
  }, {
    title: 'Sellevision3',
    author: 'Augusten Burroughs',
    description: 'Sellevision a novel is the first work published by Augusten Burroughs, author of the best-selling books Running with Scissors, Dry, and Magical Thinking. Unlike Burroughs’ subsequent memoirs, Sellevision is a work of fiction.',
    year: 2000,
    genre: 'novel',
    image: 'http://t0.gstatic.com/images?q=tbn:ANd9GcQpzKRuDCLJ0y33XEl2w5ABvBOlYcNqz-w1LuEKoPTv9Gy1zDB3'
  },
];

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: steps.inputType,
      code: '9780312426811',
    };
  }

  nextStep(state, e) {
    debugger;
    if (state.preventDefault) {
      state.preventDefault();
    }
    var newState = Object.assign(state, {step: this.state.step + 1});
    if (this.state.step + 1 === steps.confirmation) {
      var googleBookAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
      $.getJSON(googleBookAPI + this.state.code, function(data) {
        var book = data.items[0];
        var bookInfo = {
          authors: book.volumeInfo.authors,
          title: book.volumeInfo.title,
          description: book.volumeInfo.description,
          thumbnail: book.volumeInfo.imageLinks.thumbnail
        };
        this.setState(
          Object.assign(newState, {bookInfo: bookInfo})
        );
      }.bind(this));
    } else {
      this.setState(newState);
    }
  }

  f() {
    var that = this;
    var App = {
      init: function() {
        Quagga.init(this.state, function(err) {
          if (err) {
            console.log(err);
            return;
          }
          Quagga.start();
        });
      },
      state: {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 480,
            facing: 'environment' // or user
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: 4,
        decoder: {
          readers: ['ean_reader']
        },
        locate: true
      },
      lastResult: null
    };

    App.init();

    Quagga.onProcessed(function(result) {
      var drawingCtx = Quagga.canvas.ctx.overlay;
      var drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(
            drawingCanvas.getAttribute('width')),
            parseInt(drawingCanvas.getAttribute('height')
          ));
          result.boxes.filter(function(box) {
            return box !== result.box;
          }).forEach(function(box) {
            Quagga.ImageDebug.drawPath(
              box, {x: 0, y: 1}, drawingCtx, {color: 'green', lineWidth: 2}
            );
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(
            result.box, {x: 0, y: 1}, drawingCtx, {color: '#00F', lineWidth: 2}
          );
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'},
            drawingCtx, {color: 'red', lineWidth: 3});
        }
      }
    });

    Quagga.onDetected(function(result) {
      var code = result.codeResult.code;
      if (App.lastResult !== code) {
        App.lastResult = code;
        that.nextStep({code: code, barcode: false});
      }
    });
  }

  componentDidUpdate() {
    $('select').material_select();
    if (this.state.barcode) {
      this.f();
    }
  }

  toggleModal(book) {
    this.setState({overlay: book});
  }

  isbnChange(e) {
    this.setState({code: e.target.value});
  }

  render() {
    var content = (
      <div className="center">
        <h5>Get recommendations based on a book of your liking:</h5>
        <BookInputOption
          onClick={this.nextStep.bind(this, {barcode: true})}
          icon={'camera'}
          text='Scan the books bar code'
        />
        <BookInputOption
          onClick={this.nextStep.bind(this)}
          icon={'fingerprint'}
          text='Enter books ISBN code'
        />
      </div>
    );
    if (this.state.step === steps.input) {
      if (this.state.barcode) {
        content = (
          <div>
            <div id="interactive" className="viewport"></div>

            <a
              onClick={this.nextStep.bind(this, {barcode: false, code: 2000})}
              className="waves-effect waves-light btn-large"
            >
              Cheat next
            </a>
          </div>
        );
      } else {
        content = (
          <div className="center">
            <div className="row">
              <form className="col s12" onSubmit={this.nextStep.bind(this)}>
                <div className="row">
                  <div className="input-field col s12">
                    <input
                      placeholder="ISBN Code"
                      id="isbn" type="text"
                      className="validate"
                      value={this.state.code}
                      onChange={this.isbnChange.bind(this)}
                    />
                    <label htmlFor="isbn">ISBN Code</label>
                  </div>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="action">
                  Submit
                </button>
              </form>
            </div>
          </div>
        );
      }
    } else if (this.state.step === steps.confirmation) {
      content = (
        <div className="center">
          <h5>
            The book you scanned is: {this.state.bookInfo.title}
          </h5>
          <img src={'http://covers.openlibrary.org/b/isbn/' + this.state.code + '-L.jpg'}/>
          <a
            href='#'
            onClick={this.nextStep.bind(this)}
            className="waves-effect waves-light btn-large"
          >
            Get recommendations
          </a>
        </div>
      );
    } else if (this.state.step === steps.recommendations) {
      var recommendedElements = recommendedSamples.map((recommendation, i) => {
        return (
          <div className="col-xs-4" key={'rec-' + i}>
            <BookRecommendation
              book={recommendation}
              onClick={this.toggleModal.bind(this, recommendation)}
            />
          </div>
        );
      });
      content = (
        <div className="center">
          <h5>
            Similar books are:
          </h5>

          <div>
            Please select the books that you are mostly
            interested in to get further recommendations
          </div>
          <div className="row">
            {recommendedElements}
          </div>
          <a
            onClick={this.nextStep.bind(this)}
            className="waves-effect waves-light btn-large"
          >
            Expand recommendations
          </a>
        </div>
      );
    } else if (this.state.step === steps.results) {
      var recommendedElements = [];
      for (var i = 0; i < 10; i++) {
        recommendedSamples.forEach((recommendation, j) => {
          recommendedElements.push(
            <div className="col-xs-4" key={'rec-' + j + '-' + i} >
              <BookPicture
                book={recommendation}
                onClick={this.toggleModal.bind(this, recommendation)}
              />
            </div>
          );
        });
      }
      content = (
        <div className="center">
          <div className="row">
            <div className="col-xs-9">
              Results:
            </div>
            <div className="col-xs-3">
              <div className="input-field col s12">
                <select defaultValue="Sort by: ">
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                </select>
                <label>Sort</label>
              </div>
            </div>
          </div>
          <div className='row'>
            {recommendedElements}
          </div>
        </div>
      );
    }
    return (
      <div>
        <Header/>
        {content}
        {this.state.overlay ?
          <BookModal
            onClick={this.toggleModal.bind(this, null)}
            book={this.state.overlay}
          /> :
          null
        }
      </div>
    );
  }
}

ReactDOM.render(
  (<Main/>),
  document.getElementById('example')
);
