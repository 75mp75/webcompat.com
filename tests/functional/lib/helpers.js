"use strict";
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/*eslint no-console: ["error", { allow: ["log", "error"] }] */
const intern = require("intern").default;
const pollUntil = require("leadfoot/helpers/pollUntil");

var config = intern.config;

var url = function (path, params) {
  path = path ? path : "";
  var base = intern.config.functionalBaseUrl + path;
  return params ? base + params : base;
};

/*
Use this method to make sure a page is loaded before trying to find
things inside of it. The optional boolean longer arg at the end can
be used for tests that need more time.
*/
function openPage(context, path, readySelector, longerTimeout) {
  var timeout = longerTimeout ? 20000 : config.functionalTimeouts.pageLoad;

  return (
    context.remote
      .get(path)
      .setFindTimeout(timeout)
      // Wait until the `readySelector` element is found to return.
      .findByCssSelector(readySelector)
      .end()
      .then(null, function (err) {
        return context.remote
          .getCurrentUrl()
          .then(function (resultUrl) {
            console.log("Error fetching %s", resultUrl);
          })
          .end()
          .then(function () {
            throw err;
          });
      })
  );
}

function login(context) {
  return openPage(context, url("login"), "body").end();
}

function logout(context) {
  return openPage(context, url("logout"), "body").clearCookies().end();
}

function setCookie(context, cookie) {
  return openPage(context, url(), "body").setCookie(cookie).sleep(500).end();
}

function deleteCookie(context, cookieName) {
  return openPage(context, url(), "body").deleteCookie(cookieName).end();
}

module.exports = {
  login: login,
  logout: logout,
  openPage: openPage,
  pollUntil: pollUntil,
  setCookie: setCookie,
  deleteCookie: deleteCookie,
};
