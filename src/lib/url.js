/* eslint key-spacing: "off" */
import { isUndefined } from './instance';

export function parseURL(url) {
  const regex = /^(http[s]?):\/\/(?:([^:/]+):([^@/]+)@)?([^/:]+)(?::([^/]+))?(?:(\/.*))?$/;
  const captured = url.match(regex);
  if (captured !== null && !isUndefined(captured[0]) && captured.length > 0) {
    return {
      protocol: captured[1],
      user:     captured[2],
      password: captured[3],
      host:     captured[4],
      port:     isUndefined(captured[5]) ? defaultPort(captured[1]) : +captured[5],
      path:     captured[6],
    };
  }
  throw new Error(`url.parseURL(${url}): INVALID URL FORMAT. Expected [http|https]://{user:pass@}host{:port}/path`);
}

const defaultPort = protocol => (protocol === 'http' ? 80 : 443);

export default parseURL;
