require('dotenv').load();

var Promise = require('es6-promise').Promise,
    request = require('superagent'),
    md5     = require('md5');

var API_URL  = '.api.mailchimp.com/3.0/lists/',
    DATACENTER  = process.env.DATACENTER,
    API_KEY  = process.env.API_KEY,
    USERNAME = process.env.USERNAME,
    STATUS   = process.env.STATUS;

function urlForList(list) {
  return 'https://' + DATACENTER + API_URL + list + '/members/';
}

function urlForUser(emailAddress,list) {
  return urlForList(list) + md5(emailAddress);
}

function updateSubscription(emailAddress,list) {
  return new Promise(function(resolve, reject) {
    request.patch(urlForUser(emailAddress,list))
      .auth(USERNAME, API_KEY)
      .send({ status: STATUS })
      .end(function(err, res) {
        if (err) {
          console.log('ERROR', err);
          reject({ status: err.status, message: err.response.text });
        } else {
          resolve(res.body);
        }
      });
  });
}

function createSubscription(emailAddress,list) {
  return new Promise(function(resolve, reject) {
    request.post(urlForList(list))
      .auth(USERNAME, API_KEY)
      .send({ email_address: emailAddress, status: STATUS })
      .end(function(err, res) {
        if (err) {
          console.log('ERROR', err);
          reject({ status: err.status, message: err.response.text });
        } else {
          resolve(res.body);
        }
      });
  });
}

exports.handler = function(event, context) {
  var emailAddress = event.email;
  var list = event.list;
  function create() {
    createSubscription(emailAddress, list)
      .then(function(responseBody) {
        context.succeed(responseBody);
      })
      .catch(function(err) {
        context.fail(new Error(err));
      });
  }

  updateSubscription(emailAddress,list)
    .then(function(responseBody) {
      context.succeed(responseBody);
    })
    .catch(function(err) {
      if (err.status === 404) {
        create();
      }
    });
};
