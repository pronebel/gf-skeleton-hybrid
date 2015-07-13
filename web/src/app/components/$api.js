'use strict';

// ngInject
var $api = ($http) => {
  var _maps = {},
    _urlPrfix = '';

  function _buildUrl(toUrl, params) {
    if (!params) return toUrl;

    _.each(params, function(val) {
      if (toUrl.indexOf('/:') > -1) {
        toUrl = toUrl.replace(/\/:[^/]+/, '/' + val);
      } else {
        toUrl = toUrl + '/' + val;
      }
    });
    return toUrl;
  }

  // endpont[, url part arr][,data/params][,opt]
  function helper(endpoint, params=null, opt={}) {
    var _api = _maps[endpoint], embedded = null;
    if (!_api) throw new Error('Endpint ' + endpoint + 'Does Not Exist!');

    if(params) {
      if(params.__embed) {
        embedded = params.__embed;
        delete params.__embed;
      }
      if (/(DELETE)|(GET)/.test(_api.method)) {
        opt.params = params;
      } else {
        opt.data = params;
      }
    }

    return $http(_.extend({
      method: _api.method,
      url: _buildUrl(_api.url, embedded), // case for /:id/:cate/info
    }, opt));
  }

  helper.config = function(maps, opt) {
    var _prefix = _urlPrfix;
    if (opt && opt.urlPrefix) {
      _prefix = opt.urlPrefix;
    }
    _.each(maps, function(apiStr, key) {
      maps[key] = {
        method: apiStr.split(' ')[0],
        url: _prefix + apiStr.split(' ')[1]
      };
    });
    _maps = _.extend(_maps, maps);
  };

  helper.getUrl = function(endpoint) {
    var args = _.toArray(arguments);
    var _api = _maps[args.shift()];
    return _buildUrl(_api.url, args)
  };

  return helper;
};
export default $api;
