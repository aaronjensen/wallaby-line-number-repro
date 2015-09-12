const foo = require('inject!../lib/foo'); // Start wallaby, then after you get the failure, change libf to lib
require('../lib/bar');

describe('i work', () => {
  beforeEach(() => {
    (() => foo).bind(this);
  });
  it('report', () => {
    console.log(foo);
    expect(4).to.eql(4);
  });
});
(function() {}).bind({})
