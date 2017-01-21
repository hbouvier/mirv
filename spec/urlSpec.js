/* eslint no-console: 0 */
'use strict';

const url = require('../lib/url');

describe("URL library", function() {
  it("expect http://host/path protocol to be http and port 80", function() {
    const parts = url.parse('http://host/path');
    expect(parts.protocol).toBe('http');
    expect(parts.port).toBe(80);
  });
  it("expect https://host/path protocol to be https and port to be 443", function() {
    const parts = url.parse('https://host/path');
    expect(parts.protocol).toBe('https');
    expect(parts.port).toBe(443);
  });
  it("http://host:8080/path protocol to be http and port to be 8080", function() {
    const parts = url.parse('http://host:8080/path');
    expect(parts.protocol).toBe('http');
    expect(parts.port).toBe(8080);
  });
  it("expect https://host:8443/path protocol to be https and port to be 8443", function() {
    const parts = url.parse('https://host:8443/path');
    expect(parts.protocol).toBe('https');
    expect(parts.port).toBe(8443);
  });
});
