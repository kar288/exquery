'use strict';

const steps = {
  'inputType': 0,
  'input': 1,
  'confirmation': 2,
  'recommendations': 3,
  'results': 4
};

const sortOptions = {
  'author': 0,
  'title': 1,
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: steps.inputType,
      // code: '9785170811373',
      sorting: 'author',
    };
  }

  nextStep(state, e) {
    if (state.preventDefault) {
      state.preventDefault();
    }
    var newState = Object.assign(state, {step: this.state.step + 1});
    if (newState.step === steps.confirmation) {
      var googleBookAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
      var code = this.state.code ? this.state.code : newState.code;
      $.getJSON(this.googleApiUrl(code), function(data) {
        if (data.totalItems === 0) {
          this.setState(
            Object.assign(newState, {error: 'Couldn\'t find book'})
          );
        }
        var bookInfo = this.getBookInfo(data.items[0], code);
        this.setState(
          Object.assign(newState, {bookInfo: bookInfo})
        );
      }.bind(this));
    } else if (newState.step === steps.recommendations) {
      $.getJSON('/getBookRecommendations/' + this.state.code, function(data) {
        var recommendationIsbns = data.recommendations;
        var doneRecs = 0;
        var recommendations = [];
        recommendationIsbns.forEach(code => {
          $.getJSON(this.googleApiUrl(code), function(data) {
            if (data.totalItems === 0) {
              return this.setState(newState);
            }
            var bookInfo = this.getBookInfo(data.items[0], code);
            recommendations.push(bookInfo);
            if (recommendations.length === recommendationIsbns.length) {
              this.setState(
                Object.assign(newState, {recommendations: recommendations})
              );
            }
          }.bind(this));
        });
      }.bind(this));
    } else if (newState.step === steps.results) {
      var url = '/getResults/';
      if (this.state.onBooks && this.state.onBooks.size) {
        url += Array.from(this.state.onBooks).join(',') + ',';
      }
      url += this.state.code;
      $.getJSON(url, function(data) {
        var resultIsbns = data.results;
        var results = [];
        resultIsbns.forEach(code => {
          $.getJSON(this.googleApiUrl(code), function(data) {
            if (data.totalItems === 0) {
              results.push({});
            } else {
              var bookInfo = this.getBookInfo(data.items[0], code);
              results.push(bookInfo);
            }
            if (results.length === resultIsbns.length) {
              this.sortResults(results, this.state.sorting);
              this.setState(
                Object.assign(newState, {results: results})
              );
            }
          }.bind(this));
        });
      }.bind(this));
    } else {
      this.setState(newState);
    }
  }

  googleApiUrl(isbn) {
    return 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
  }

  getBookInfo(book, code) {
    var thumbnail = '';
    if (book.volumeInfo.imageLinks) {
      thumbnail = book.volumeInfo.imageLinks.thumbnail;
    } else {
      console.log(code);
    }
    return {
      isbn: code,
      author: book.volumeInfo.authors[0],
      title: book.volumeInfo.title,
      description: book.volumeInfo.description,
      thumbnail: thumbnail,
    };
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
    $('.select-wrapper').change(function() {
      var selected = $('.select-wrapper')
        .children('ul')
        .children('.selected')
        .children('span');
      this.changeSorting(selected.text());
    }.bind(this));
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

  turnBookOff(book, e) {
    var onBooks = this.state.onBooks || new Set();
    if (onBooks.has(book.isbn)) {
      onBooks.delete(book.isbn);
    } else {
      onBooks.add(book.isbn);
    }
    this.setState({onBooks: onBooks});
  }

  sortResults(results, option) {
    results.sort(function(a, b) {
      return a[option] > b[option];
    });
  }

  changeSorting(option, e) {
    var results = this.state.results;
    this.sortResults(results, option);
    this.setState({sorting: option, results: results});
  }

  render() {
    var content = (
      <div className='center'>
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
    if (this.state.error) {
      content = <div>{this.state.error}</div>;
    } else if (this.state.step === steps.input) {
      if (this.state.barcode) {
        content = (
          <div>
            <div id='interactive' className='viewport'></div>

            <a
              onClick={this.nextStep.bind(this, {barcode: false, code: 2000})}
              className='waves-effect waves-light btn-large'
            >
              Cheat next
            </a>
          </div>
        );
      } else {
        content = (
          <div className='center'>
            <div className='row'>
              <form className='col s12' onSubmit={this.nextStep.bind(this)}>
                <div className='row'>
                  <div className='input-field col s12'>
                    <input
                      placeholder='ISBN Code'
                      id='isbn' type='text'
                      className='validate'
                      value={this.state.code}
                      onChange={this.isbnChange.bind(this)}
                    />
                    <label htmlFor='isbn'>ISBN Code</label>
                  </div>
                </div>
                <button
                  className='btn waves-effect waves-light'
                  type='submit'
                  name='action'
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        );
      }
    } else if (this.state.step === steps.confirmation) {
      content = (
        <div className='center'>
          <h5>
            The book you scanned is: {this.state.bookInfo.title}
          </h5>
          <img className='big-book-cover' src={this.state.bookInfo.thumbnail}/>
          <a
            href='#'
            onClick={this.nextStep.bind(this)}
            className='waves-effect waves-light btn-large'
          >
            Get recommendations
          </a>
        </div>
      );
    } else if (this.state.step === steps.recommendations) {
      var recommendedElements = this.state.recommendations.map((book, i) => {
        return (
          <div className='s' key={'rec-' + i}>
            <BookRecommendation
              book={book}
              onClick={this.toggleModal.bind(this, book)}
              onSwitch={this.turnBookOff.bind(this, book)}
            />
          </div>
        );
      });
      content = (
        <div className='center'>
          <h5>
            Similar books are:
          </h5>

          <div>
            Please select the books that you are mostly
            interested in to get further recommendations
          </div>
          <div className='row'>
            {recommendedElements}
          </div>
          <a
            onClick={this.nextStep.bind(this)}
            className='waves-effect waves-light btn-large'
          >
            Expand recommendations
          </a>
        </div>
      );
    } else if (this.state.step === steps.results) {
      var recommendedElements = [];
      this.state.results.forEach((book, j) => {
        recommendedElements.push(
          <div className='col s4' key={'rec-' + j} >
            <BookPicture
              book={book}
              onClick={this.toggleModal.bind(this, book)}
            />
          </div>
        );
      });
      content = (
        <div className='center'>
          <div className='row'>
            <div className='col s6'>
              Results:
            </div>
            <div className='col s6'>
              <div className='input-field col s12'>
                <select defaultValue='Sort by: '>
                  {Object.keys(sortOptions).map(function(option, i) {
                    return (
                      <option
                        key={'opt-' + i}
                        value={option}>
                        {option}
                      </option>
                    );
                  }.bind(this))}
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
        <Header filters={this.state.step === steps.results} />
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
