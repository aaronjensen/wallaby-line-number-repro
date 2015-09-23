const foo = require('inject!../lib/foo');

describe('i work', () => {
  beforeEach(() => {
    foo({'./bar': {}});
    (() => foo).bind(this);
  });
  it('report', () => {
    console.log(foo);
    expect(4).to.eql(4);
  });
});
(function() {}).bind({})
