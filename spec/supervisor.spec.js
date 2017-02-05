const mirv = require('../lib');
describe("Supervisor", () => {
  it("Supervisorand so is a spec", () => {
    var cpt = 0;
    const worker = (config, logger) => {++cpt;}
    mirv.supervisor(worker, {isUnitTest: true,level:'ERROR'});
    setTimeout(() => {
      expect(cpt).toBe(1);
      done();
    },10);
  });
});
