/* eslint no-undef: off */
import { engineSatisfies, satisfies } from '../lib/semver';

describe('Sementic Versionning', () => {
  it('nodejs engine must satisfy version greater than 7.x.x', () => {
    expect(() => engineSatisfies('7')).not.toThrowError(/allo/);
  });

  it('version 7.0.1 satisfies 7', () => {
    expect(() => satisfies('7.0.1', '7')).not.toThrowError(/The version/);
  });

  it('version 6.9.9 does not satisfies 7', () => {
    expect(() => satisfies('6.9.9', '7')).toThrowError(/The version/);
  });

  it('version 7.0.1 does not satisfies 7.0.2', () => {
    expect(() => satisfies('7.0.1', '7.0.2')).toThrowError(/The version/);
  });
});
