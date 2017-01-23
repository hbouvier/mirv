const mirv = require('../lib');
describe("rest", function() {
  it("route is invoked", function() {
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
