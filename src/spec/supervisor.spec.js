/* eslint no-undef: off */
import * as mirv from '../lib';

describe('Supervisor', () => {
  it('Supervisorand so is a spec', () => {
    let cpt = 0;
    const worker = () => { cpt += 1; };
    mirv.supervisor({ worker, config: { isUnitTest: true, level: 'ERROR' } });
    setTimeout(() => {
      expect(cpt).toBe(1);
      done();
    }, 10);
  });
});
