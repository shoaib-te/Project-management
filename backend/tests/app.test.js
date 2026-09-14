import app from '../src/app.js';

describe('backend app', () => {
  it('exports an Express application', () => {
    expect(typeof app).toBe('function');
    expect(typeof app.listen).toBe('function');
  });
});
