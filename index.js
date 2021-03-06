/* jshint node: true */
'use strict';
var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var fbTransform = require('fastboot-transform');


module.exports = {
  name: 'ember-cli-daterangepicker',

  included() {

    this.app = this._findHost.call(this);
    this._super.included.apply(this, arguments);

    this.import('vendor/bootstrap-daterangepicker/daterangepicker.js');

  },

  getDateRangePickerStylesPath() {

    let nodeModulesPath = this.app.project.nodeModulesPath;
    return path.join(nodeModulesPath, 'bootstrap-daterangepicker/daterangepicker.scss');

  },

  treeForStyles(){

    return new Funnel(this.getDateRangePickerStylesPath(), {
      destDir: 'ember-cli-daterangepicker'
    });


  },

  treeForVendor: function(vendorTree) {
    var trees = [];
    var daterangepickerPath = path.dirname(require.resolve('bootstrap-daterangepicker'));

    if (vendorTree) {
      trees.push(vendorTree);
    }

    //need to wrap with check if it's inside fastboot environment
    trees.push(fbTransform(new Funnel(daterangepickerPath, {
      destDir: 'bootstrap-daterangepicker',
      include: [new RegExp(/\.js$/)],
      exclude: [
        'moment',
        'moment.min',
        'package',
        'website'
      ].map(function(key) {
        return new RegExp(key + '\.js$');
      })
    })));
    trees.push(new Funnel(daterangepickerPath, {
      destDir: 'bootstrap-daterangepicker',
      include: [new RegExp(/\.scss$/)]
    }));

    return mergeTrees(trees);
  }
};
