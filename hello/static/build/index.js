// import Counter from './counter';

ReactDOM.render(React.createElement(
  'div',
  null,
  React.createElement(
    'h1',
    null,
    'Hello, world!'
  ),
  React.createElement(Counter, { initialCount: 20 })
), document.getElementById('example'));

var a = [1, 2, 3, 4, 5];
a.forEach(b => console.log(b));

console.log('aaaaa');