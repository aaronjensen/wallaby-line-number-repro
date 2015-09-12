require('../libf/foo.js'); // Start wallaby, then after you get the failure, change libf to lib
require('../libf/bar.js');

describe('i work', () => {
  it('report', () => {
    expect(4).to.eql(4);
  });
});
(function() {}).bind({})
