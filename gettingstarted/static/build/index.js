'use strict';

const steps = {
  'inputType': 0,
  'input': 1,
  'confirmation': 2,
  'recommendations': 3,
  'results': 4
};

var recommendedSamples = [{
  title: 'Sellevision',
  author: 'Augusten Burroughs',
  description: 'Sellevision a novel is the first work published by Augusten Burroughs, author of the best-selling books Running with Scissors, Dry, and Magical Thinking. Unlike Burroughs’ subsequent memoirs, Sellevision is a work of fiction.',
  year: 2000,
  genre: 'novel',
  image: 'http://t2.gstatic.com/images?q=tbn:ANd9GcQfUY4XR6yDsV-vNwsS6rN447724qTUnyIEbmtYfBBgGCUxlr7_'
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
}];

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: steps.inputType,
      code: '9780312426811'
    };
  }

  nextStep(state, e) {
    var state = Object.assign(state, { step: this.state.step + 1 });
    state.preventDefault();
    if (this.state.step + 1 === steps.confirmation) {
      var googleBookAPI = 'https://www.googleapis.com/books/v1/volumes?q=isbn:';
      $.getJSON(googleBookAPI + this.state.code, function (data) {
        var book = data.items[0];
        var bookInfo = {
          authors: book.volumeInfo.authors,
          title: book.volumeInfo.title,
          description: book.volumeInfo.description,
          thumbnail: book.volumeInfo.imageLinks.thumbnail
        };
        this.setState(Object.assign(state, { bookInfo: bookInfo }));
      }.bind(this));
    } else {
      this.setState(state);
    }
  }

  f() {
    var that = this;
    var App = {
      init: function () {
        Quagga.init(this.state, function (err) {
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

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay;
      var drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
          result.boxes.filter(function (box) {
            return box !== result.box;
          }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
          });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
      }
    });

    Quagga.onDetected(function (result) {
      var code = result.codeResult.code;
      if (App.lastResult !== code) {
        App.lastResult = code;
        that.nextStep({ code: code, barcode: false });
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
    this.setState({ overlay: book });
  }

  isbnChange(e) {
    this.setState({ code: e.target.value });
  }

  render() {
    var content = React.createElement(
      'div',
      { className: 'center' },
      React.createElement(
        'h5',
        null,
        'Get recommendations based on a book of your liking:'
      ),
      React.createElement(BookInputOption, {
        onClick: this.nextStep.bind(this, { barcode: true }),
        icon: 'camera',
        text: 'Scan the books bar code'
      }),
      React.createElement(BookInputOption, {
        onClick: this.nextStep.bind(this),
        icon: 'fingerprint',
        text: 'Enter books ISBN code'
      })
    );
    if (this.state.step === steps.input) {
      if (this.state.barcode) {
        content = React.createElement(
          'div',
          null,
          React.createElement('div', { id: 'interactive', className: 'viewport' }),
          React.createElement(
            'a',
            {
              onClick: this.nextStep.bind(this, { barcode: false, code: 2000 }),
              className: 'waves-effect waves-light btn-large'
            },
            'Cheat next'
          )
        );
      } else {
        content = React.createElement(
          'div',
          { className: 'center' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
              'form',
              { className: 'col s12', onSubmit: this.nextStep.bind(this) },
              React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                  'div',
                  { className: 'input-field col s12' },
                  React.createElement('input', {
                    placeholder: 'ISBN Code',
                    id: 'isbn', type: 'text',
                    className: 'validate',
                    value: this.state.code,
                    onChange: this.isbnChange.bind(this)
                  }),
                  React.createElement(
                    'label',
                    { htmlFor: 'isbn' },
                    'ISBN Code'
                  )
                )
              ),
              React.createElement(
                'button',
                { className: 'btn waves-effect waves-light', type: 'submit', name: 'action' },
                'Submit'
              )
            )
          )
        );
      }
    } else if (this.state.step === steps.confirmation) {
      content = React.createElement(
        'div',
        { className: 'center' },
        React.createElement(
          'h5',
          null,
          'The book you scanned is: ',
          this.state.bookInfo.title
        ),
        React.createElement('img', { src: 'http://covers.openlibrary.org/b/isbn/' + this.state.code + '-L.jpg' }),
        React.createElement(
          'a',
          {
            href: '#',
            onClick: this.nextStep.bind(this),
            className: 'waves-effect waves-light btn-large'
          },
          'Get recommendations'
        )
      );
    } else if (this.state.step === steps.recommendations) {
      var recommendedElements = recommendedSamples.map((recommendation, i) => {
        return React.createElement(
          'div',
          { className: 'col-xs-4', key: 'rec-' + i },
          React.createElement(BookRecommendation, {
            book: recommendation,
            onClick: this.toggleModal.bind(this, recommendation)
          })
        );
      });
      content = React.createElement(
        'div',
        { className: 'center' },
        React.createElement(
          'h5',
          null,
          'Similar books are:'
        ),
        React.createElement(
          'div',
          null,
          'Please select the books that you are mostly interested in to get further recommendations'
        ),
        React.createElement(
          'div',
          { className: 'row' },
          recommendedElements
        ),
        React.createElement(
          'a',
          {
            onClick: this.nextStep.bind(this),
            className: 'waves-effect waves-light btn-large'
          },
          'Expand recommendations'
        )
      );
    } else if (this.state.step === steps.results) {
      var recommendedElements = [];
      for (var i = 0; i < 10; i++) {
        recommendedSamples.forEach((recommendation, j) => {
          recommendedElements.push(React.createElement(
            'div',
            { className: 'col-xs-4', key: 'rec-' + j + '-' + i },
            React.createElement(BookPicture, {
              book: recommendation,
              onClick: this.toggleModal.bind(this, recommendation)
            })
          ));
        });
      }
      content = React.createElement(
        'div',
        { className: 'center' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'col-xs-9' },
            'Results:'
          ),
          React.createElement(
            'div',
            { className: 'col-xs-3' },
            React.createElement(
              'div',
              { className: 'input-field col s12' },
              React.createElement(
                'select',
                { defaultValue: 'Sort by: ' },
                React.createElement(
                  'option',
                  { value: 'title' },
                  'Title'
                ),
                React.createElement(
                  'option',
                  { value: 'author' },
                  'Author'
                )
              ),
              React.createElement(
                'label',
                null,
                'Sort'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          recommendedElements
        )
      );
    }
    return React.createElement(
      'div',
      null,
      React.createElement(Header, null),
      content,
      this.state.overlay ? React.createElement(BookModal, {
        onClick: this.toggleModal.bind(this, null),
        book: this.state.overlay
      }) : null
    );
  }
}

ReactDOM.render(React.createElement(Main, null), document.getElementById('example'));