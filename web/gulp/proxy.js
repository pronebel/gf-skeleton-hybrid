 /*jshint unused:false */

/***************

  This file allow to configure a proxy system plugged into BrowserSync
  in order to redirect backend requests while still serving and watching
  files from the web project

  IMPORTANT: The proxy is disabled by default.

  If you want to enable it, watch at the configuration options and finally
  change the `module.exports` at the end of the file

***************/

'use strict';

var httpProxy = require('http-proxy');
var chalk = require('chalk');

/*
 * Location of your backend server
 */
var proxyTarget = 'https://auth.gf.com.cn/';

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  console.error(chalk.red('[Proxy]'), error);
});

/*
 * The proxy middleware is an Express middleware added to BrowserSync to
 * handle backend request and proxy them to your backend.
 */
function proxyMiddleware(req, res, next) {
  /*
   * This test is the switch of each request to determine if the request is
   * for a static file to be handled by BrowserSync or a backend request to proxy.
   *
   * The existing test is a standard check on the files extensions but it may fail
   * for your needs. If you can, you could also check on a context in the url which
   * may be more reliable but can't be generic.
   */
  if(/legacy/i.test(req.url)) {
    req.url = req.url.replace('/legacy', '');
    proxy.web(req, res);
  } else {
    next();
  }
}

/*
 * This is where you activate or not your proxy.
 *
 * The first line activate if and the second one ignored it
 */

 // fake data
 function requireUncached(module) {
     try {
         delete require.cache[require.resolve(module)]
     } catch (e) {
         console.log(e);
     }
     return require(module)
 }
var _ = require('lodash');
function fakeApi(req, res, next) {
  _.each(requireUncached('./mock/config'), function(data, url) {
      var method = url.split(' ')[0];
      var path = new RegExp(url.split(' ')[1]);

      if (req.method === method && path.test(req.url)) {
          if (_.isFunction(data)) {
              data = data(req);
          }
          res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8'
          });
          return res.end(JSON.stringify(data), 'utf8');
      }
  });
  next();
}

// module.exports = [proxyMiddleware];
module.exports = function() {
  return [proxyMiddleware, fakeApi];
};
