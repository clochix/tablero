/*
 * Copyright 2014 Thoughtworks Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
  'flight/lib/component',
  'with-request'
  ], function (defineComponent, withRequest) {
  'use strict';
  return defineComponent(configManager, withRequest);

  function configManager() {
    this.retrieve = function () {
      $(document).trigger('ui:blockUI');
      var that = this;
      /*
      $.ajax({
        method: 'GET',
        url: 'columns',
      }).done(function (data) {
        if (_.isEmpty(data)) {
          data = {};
        }
        that.trigger(document, 'data:got:columns', data);
      });
      */
    };

    this.store = function (event, config) {
      this.post({
        url: 'config',
        data: JSON.stringify(config),
        contentType: 'application/json'
      });
    };

    this.after('initialize', function () {
      this.on('data:store:config', this.store);
    });
  }
});