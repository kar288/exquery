'use strict';

var f = function() {
  console.log('jkdfajlk');
  Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream"
    },
    decoder : {
      readers : ["code_128_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });
}

const steps = {
  'inputType': 0,
  'input': 1,
  'confirmation': 2,
  'recommendations': 3,
  'results': 4
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {step: steps.inputType};
  }

  nextStep() {
    this.setState({step: this.state.step + 1});
  }

  componentDidUpdate() {
    $('select').material_select();
  }

  render() {
    var content = (
      <div className="center">
        <h5>Get recommendations based on a book of your liking:</h5>
        <BookInputOption
          onClick={f}
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
      content = (
        <div className="center">
          <div className="row">
            <form className="col s12" onSubmit={this.nextStep.bind(this)}>
              <div className="row">
                <div className="input-field col s12">
                  <input placeholder="ISBN Code" id="isbn" type="text" className="validate"/>
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
    } else if (this.state.step === steps.confirmation) {
      content = (
        <div className="center">
          <h5>
            The book you scanned is:
          </h5>
          <img src=""/>
          <a
            onClick={this.nextStep.bind(this)}
            className="waves-effect waves-light btn-large"
          >
            Get recommendations
          </a>
        </div>
      );
    } else if (this.state.step === steps.recommendations) {
      content = (
        <div className="center">
          <h5>
            Similar books are:
          </h5>

          <div>
            Please select the books that you are mostly
            interested in to get further recommendations
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
      content = (
        <div className="center">
          <div className="row">
            <div className="col-xs-9">
              Results:
            </div>
            <div className="col-xs-3">
              <div className="input-field col s12">
                <select>
                  <option value="" disabled selected>Sort By:</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                </select>
                <label>Sort</label>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <Header/>
        {content}
      </div>
    );
  }
}

ReactDOM.render(
  (<Main/>),
  document.getElementById('example')
);


var a = [1, 2, 3, 4, 5];
// a.forEach(b => console.log(b));

console.log('bbbb');

$(function() {
    var App = {
        init : function() {
            Quagga.init(this.state, function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                // App.attachListeners();
                Quagga.start();
            });
        },
        state: {
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facing: "environment" // or user
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 4,
            decoder: {
                readers : ["ean_reader"]
            },
            locate: true
        },
        lastResult : null
    };

    App.init();

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;

        if (App.lastResult !== code) {
            App.lastResult = code;
            var $node = null, canvas = Quagga.canvas.dom.image;

            $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
            $node.find("img").attr("src", canvas.toDataURL());
            $node.find("h4.code").html(code);
            $("#result_strip ul.thumbnails").prepend($node);
        }
    });
});
