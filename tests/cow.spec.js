import cow from '../src/cow';

describe('cow', () => {
  it('should have a cow', () => {
    expect(cow).to.exist;
  });

  it('should be a function', () => {
    expect(typeof cow).to.be.equal('function');
  });

  it('should return null', () => {
    expect(cow()).to.be.null;
  });
});
