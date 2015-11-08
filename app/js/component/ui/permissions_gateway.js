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
  'config/config_bootstrap',
  'jquery-cookie/jquery.cookie'
  ],
  function (defineComponent, config, cookie) {
    'use strict';
    return defineComponent(permissionsGateway);

    function permissionsGateway() {
      var that = this;
      this.defaultAttrs({

      });

      this.showRepository = function (repository) {
        var access = repository || $.cookie('access') || 'public_repo',
            token  = $.cookie('token');
        this.$node.modal('hide');
        $.cookie('access', access, { expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)) } );
        if (token) {
          $.cookie('token', token, { expires: new Date(Date.now() + 3600000) } );
          config.set('token', token);
          $(document).trigger('ui:needs:columns');
        } else {
          var authorizeUrl = 'https://github.com/login/oauth/authorize?client_id=' + config.get('clientId') + '&scope=' + access;
          window.open(authorizeUrl);
        }
      };

      this.showPublic = function () {
        this.showRepository('public_repo');
      };

      this.showPublicAndPrivate = function () {
        this.showRepository('repo');
      };

      this.showModal = function () {
        this.$node.modal({
          backdrop: 'static',
          keyboard: false
        });
      };

      this.triggerPermissionModal = function () {
        $(document).trigger('ui:show:permissionsModal');
      };

      this.changesSelectedAccess = function (event, selectedAccess) {
        this.showRepository(selectedAccess);
      };

      this.setUp = function () {
        $('#showPublicBtn').click(this.showPublic.bind(this));
        $('#showPublicAndPrivateBtn').click(this.showPublicAndPrivate.bind(this));
        $('#changeAccess').click(this.triggerPermissionModal.bind(this));
      };

      this.after('initialize', function () {
        this.setUp();
        this.on(document, 'ui:show:permissionsModal', this.showModal.bind(this));
        this.on(document, 'ui:show:permissionSelected', this.changesSelectedAccess.bind(this));
      });
    }
  });
