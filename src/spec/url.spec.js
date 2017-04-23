/* eslint no-undef: off */
import { parseURL } from '../lib/url';

describe('URL library', () => {
  it('expect http://host/path protocol to be http and port 80', () => {
    const parts = parseURL('http://host/path');
    expect(parts.protocol).toBe('http');
    expect(parts.port).toBe(80);
  });
  it('expect https://host/path protocol to be https and port to be 443', () => {
    const parts = parseURL('https://host/path');
    expect(parts.protocol).toBe('https');
    expect(parts.port).toBe(443);
  });
  it('http://host:8080/path protocol to be http and port to be 8080', () => {
    const parts = parseURL('http://host:8080/path');
    expect(parts.protocol).toBe('http');
    expect(parts.port).toBe(8080);
  });
  it('expect https://host:8443/path protocol to be https and port to be 8443', () => {
    const parts = parseURL('https://host:8443/path');
    expect(parts.protocol).toBe('https');
    expect(parts.port).toBe(8443);
  });
  it('expect httpz://host:8443/path to be invalid (e.g. httpZ)', () => {
    expect(() => parseURL('httpz://host:8443/path')).toThrowError(/INVALID URL FORMAT/);
  });

  it('expect http://couchdb-0.couchdb.default.svc.cluster.local:5984/_node/couchdb@couchdb-0.couchdb.default.svc.cluster.local/_config/admins/admin', () => {
    const parts = parseURL('http://couchdb-0.couchdb.default.svc.cluster.local:5984/_node/couchdb@couchdb-0.couchdb.default.svc.cluster.local/_config/admins/admin');
    expect(parts.protocol).toBe('http');
    expect(parts.port).toBe(5984);
    expect(parts.path).toBe('/_node/couchdb@couchdb-0.couchdb.default.svc.cluster.local/_config/admins/admin');
  });
});
