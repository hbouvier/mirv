/* eslint no-console: 0 */
'use strict';
module.exports = {
  satisfies        : satisfies,
  engine_satisfies : v => satisfies(process.versions.node, v)
}

function satisfies(actual_version, minimum_required_version) {
  const min_semver = `${minimum_required_version}.0.0`
                      .split('.')
                      .slice(0, 3)
                      .map(s => parseInt(s));
  const actual_semver = `${actual_version}.0.0`
                          .split('.')
                          .slice(0, 3)
                          .map(s => parseInt(s));
  if (actual_semver[0] < min_semver[0] ||
      (actual_semver[0] === min_semver[0] && actual_semver[1] < min_semver[1]) ||
      (actual_semver[0] === min_semver[0] && actual_semver[1] === min_semver[1] && actual_semver[2] < min_semver[2])
     ) {
    throw new Error(`The version ${actual_semver.join('.')} of the installed nodeJS engine does not meet the minimum requirement of ${min_semver.join('.')}`);
  }
}

