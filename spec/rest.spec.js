const mirv = require('../lib');
describe("rest", () => {
  it("route is invoked", () => {
    var invoked = false;
    const routes = (app, config, logger) => {invoked = true;}
    const curriedRoutes = mirv.rest(routes);
    curriedRoutes({id:0, environment: 'test'},{info: console.log});
    setTimeout(() => {
      expect(invoked).toBe(true);
      done();
    },100);
  });
});
