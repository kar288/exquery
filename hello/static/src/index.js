// import Counter from './counter';

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

ReactDOM.render(
  (<div>
    <Header/>
    <div className="center">
      <h5>Get recommendations based on a book of your liking:</h5>
      <BookInputOption onClick={f} icon={'camera'} text='Scan the books bar code'/>
      <BookInputOption icon={'fingerprint'} text='Enter books ISBN code'/>
    </div>
  </div>),
  document.getElementById('example')
);

var a = [1, 2, 3, 4, 5];
// a.forEach(b => console.log(b));

console.log('bbbb');
