require('../../lib/bar');
const foo = require('../../lib/foo');

describe('i dont work', () => {
  it('no report', () => {
    expect(4).to.eql(4);
  });
});

(function() {}).bind({})
