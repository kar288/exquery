'use strict';

var f = function () {
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
        type: "LiveStream",
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
        readers: ["ean_reader"]
      },
      locate: true
    },
    lastResult: null
  };

  App.init();

  Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  });

  Quagga.onDetected(function (result) {
    var code = result.codeResult.code;
    that.nextStep({ code: code });
    console.log(code);
    // if (App.lastResult !== code) {
    //     App.lastResult = code;
    //     var $node = null, canvas = Quagga.canvas.dom.image;
    //
    //     $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
    //     $node.find("img").attr("src", canvas.toDataURL());
    //     $node.find("h4.code").html(code);
    //     $("#result_strip ul.thumbnails").prepend($node);
    // }
  });
};

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
    this.state = { step: steps.inputType };
  }

  nextStep(state) {
    this.setState(Object.assign(state, { step: this.state.step + 1 }));
  }

  componentDidUpdate() {
    $('select').material_select();
    if (this.state.barcode) {
      f();
    }
  }

  render() {
    var content = React.createElement(
      "div",
      { className: "center" },
      React.createElement(
        "h5",
        null,
        "Get recommendations based on a book of your liking:"
      ),
      React.createElement(BookInputOption, {
        onClick: this.nextStep.bind(this, { barcode: true }),
        icon: 'camera',
        text: "Scan the books bar code"
      }),
      React.createElement(BookInputOption, {
        onClick: this.nextStep.bind(this),
        icon: 'fingerprint',
        text: "Enter books ISBN code"
      })
    );
    if (this.state.step === steps.input) {
      if (this.state.barcode) {
        content = React.createElement("div", { id: "interactive", className: "viewport" });
      } else {
        content = React.createElement(
          "div",
          { className: "center" },
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "form",
              { className: "col s12", onSubmit: this.nextStep.bind(this) },
              React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                  "div",
                  { className: "input-field col s12" },
                  React.createElement("input", { placeholder: "ISBN Code", id: "isbn", type: "text", className: "validate" }),
                  React.createElement(
                    "label",
                    { htmlFor: "isbn" },
                    "ISBN Code"
                  )
                )
              ),
              React.createElement(
                "button",
                { className: "btn waves-effect waves-light", type: "submit", name: "action" },
                "Submit"
              )
            )
          )
        );
      }
    } else if (this.state.step === steps.confirmation) {
      content = React.createElement(
        "div",
        { className: "center" },
        React.createElement(
          "h5",
          null,
          "The book you scanned is:"
        ),
        React.createElement("img", { src: "" }),
        React.createElement(
          "a",
          {
            onClick: this.nextStep.bind(this),
            className: "waves-effect waves-light btn-large"
          },
          "Get recommendations"
        )
      );
    } else if (this.state.step === steps.recommendations) {
      content = React.createElement(
        "div",
        { className: "center" },
        React.createElement(
          "h5",
          null,
          "Similar books are:"
        ),
        React.createElement(
          "div",
          null,
          "Please select the books that you are mostly interested in to get further recommendations"
        ),
        React.createElement(
          "a",
          {
            onClick: this.nextStep.bind(this),
            className: "waves-effect waves-light btn-large"
          },
          "Expand recommendations"
        )
      );
    } else if (this.state.step === steps.results) {
      content = React.createElement(
        "div",
        { className: "center" },
        React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col-xs-9" },
            "Results:"
          ),
          React.createElement(
            "div",
            { className: "col-xs-3" },
            React.createElement(
              "div",
              { className: "input-field col s12" },
              React.createElement(
                "select",
                null,
                React.createElement(
                  "option",
                  { value: "", disabled: true, selected: true },
                  "Sort By:"
                ),
                React.createElement(
                  "option",
                  { value: "title" },
                  "Title"
                ),
                React.createElement(
                  "option",
                  { value: "author" },
                  "Author"
                )
              ),
              React.createElement(
                "label",
                null,
                "Sort"
              )
            )
          )
        )
      );
    }
    return React.createElement(
      "div",
      null,
      React.createElement(Header, null),
      content
    );
  }
}

ReactDOM.render(React.createElement(Main, null), document.getElementById('example'));

var a = [1, 2, 3, 4, 5];
// a.forEach(b => console.log(b));

console.log('bbbb');