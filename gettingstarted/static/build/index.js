// import Counter from './counter';

var f = function () {
  console.log('jkdfajlk');
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream"
    },
    decoder: {
      readers: ["code_128_reader"]
    }
  }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  });
};

ReactDOM.render(React.createElement(
  "div",
  null,
  React.createElement(Header, null),
  React.createElement(
    "div",
    { className: "center" },
    React.createElement(
      "h5",
      null,
      "Get recommendations based on a book of your liking:"
    ),
    React.createElement(BookInputOption, { onClick: f, icon: 'camera', text: "Scan the books bar code" }),
    React.createElement(BookInputOption, { icon: 'fingerprint', text: "Enter books ISBN code" })
  )
), document.getElementById('example'));

var a = [1, 2, 3, 4, 5];
// a.forEach(b => console.log(b));

console.log('bbbb');