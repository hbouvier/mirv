export function engineSatisfies(v) {
  return satisfies(process.versions.node, v);
}

export function satisfies(actualVersion, minimumRequiredVersion) {
  const minSemver = `${minimumRequiredVersion}.0.0`
                      .split('.')
                      .slice(0, 3)
                      .map(s => +s);
  const actualSemver = `${actualVersion}.0.0`
                          .split('.')
                          .slice(0, 3)
                          .map(s => +s);
  if (actualSemver[0] < minSemver[0] ||
      (actualSemver[0] === minSemver[0] && actualSemver[1] < minSemver[1]) ||
      (actualSemver[0] === minSemver[0] && actualSemver[1] === minSemver[1] &&
       actualSemver[2] < minSemver[2])
     ) {
    throw new Error(`The version ${actualSemver.join('.')} of the installed nodeJS engine does not meet the minimum requirement of ${minSemver.join('.')}`);
  }
}
