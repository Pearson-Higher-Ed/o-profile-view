/*global describe, it*/
// 'use strict';

const expect = require('expect.js');

const UserProfileView = require('../src/js/UserProfileView');

describe('UserProfileView Init', function() {
  it('should initialize', function() {
    const av = new UserProfileView("foo", 'footoken', document.element[0], '160px, true');
    expect(av).to.not.be(null);
  });

});
