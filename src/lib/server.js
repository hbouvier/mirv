import { typeOf } from './instance';

export const server = serverArgs => (threadArgs) => {
  const { application } = serverArgs;
  const functions = typeOf(application) === 'array' ? application : [application];
  functions.forEach(f => f(Object.assign({}, serverArgs, threadArgs)));
};

export default server;
