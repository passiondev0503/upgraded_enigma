/**
 * Utility dev server.
 * It is used to set/reset client environment variables from process.env when developing a client app.
 */

const http = require('http');

const express = require('express');

const spawn = require('child_process').spawn;

const app = express();
const server = http.createServer(app);

const defaultPort = 4201;

server.listen(defaultPort, () => {
  const addr = server.address();
  // eslint-disable-next-line no-console -- needed here for debugging
  console.log(`Utility dev server listening at ${addr.address}:${addr.port}`);
});

/**
 * @function terminator
 * @summary Terminator function
 * @description Terminates application
 */
function terminator(sig) {
  if (typeof sig === 'string') {
    // eslint-disable-next-line no-console -- needed here for debugging
    console.log(`\n${Date(Date.now())}: Received signal ${sig} - terminating app...\n`);
    if (sig === 'exit') {
      /**
       * Resets client environment variables configuration to default.
       */
      const envResetter = spawn('ng', ['run', 'tools:reset-client-env'], {
        stdio: 'inherit',
        detached: true,
      });
      envResetter.on('close', code => {
        // eslint-disable-next-line no-console -- needed here for debugging
        console.log('envResetter closed');
        const errorCode = 8;
        if (code === errorCode) {
          // eslint-disable-next-line no-console -- needed here for debugging
          console.log('Error detected, waiting for changes...');
        } else {
          process.exit(0);
        }
      });
    } else {
      process.exit(0);
    }
  }
}

/**
 * Termination handlers.
 */
(() => {
  process.on('exit', () => {
    terminator('exit');
  });
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(
    element => {
      process.on(element, () => {
        terminator(element);
      });
    },
  );
})();
