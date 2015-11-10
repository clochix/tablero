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
/*global _: true*/
define(
  [
    'component/data/github_user',
    'component/data/issues_exporter',
    'component/data/prioritization_manager',
    'component/ui/issues_filter',
    'component/ui/new_issue',
    'component/ui/permissions_gateway',
    'component/mixins/with_auth_token_from_hash',
    'component/ui/columns_modal',
    'component/ui/config_modal',
    'component/ui/issue_modal',
    'component/data/columns_manager',
    'component/data/config_manager',
    'component/ui/columns_render'
  ],
  function (githubUser,
    issuesExporter,
    prioritizationManager,
    issuesFilter,
    newIssue,
    permissionsGateway,
    authToken,
    columnsModal,
    configModal,
    issueModal,
    columnsManager,
    configManager,
    columnsRender) {
    'use strict';

    return initialize;

    function initialize(config) {
      issuesFilter.attachTo($('#filters'));
      newIssue.attachTo('#myModal');
      permissionsGateway.attachTo('#permissionsGateway');
      columnsModal.attachTo('#columnsModal');
      configModal.attachTo('#configModal');
      issueModal.attachTo('#issueModal');

      $.blockUI.defaults.message = '<h2 id="loading" class="loading">Please wait...</h2>';
      $.blockUI.defaults.ignoreIfBlocked = true;
      $(document).ajaxStop($.unblockUI);

      githubUser.attachTo(document);
      issuesExporter.attachTo(document);
      prioritizationManager.attachTo(document);
      columnsManager.attachTo(document);
      configManager.attachTo(document);

      columnsRender.attachTo(document);

      $('.backlog-column .hide-icon').first().click(function () {
        $('.backlog-column').toggle('slide');
        $('.backlog-sidebar').toggle('slide');
      });
      $('.backlog-sidebar .hide-icon-sidebar').first().click(function () {
        $('.backlog-column').toggle('slide');
        $('.backlog-sidebar').toggle('slide');
      });

      $('.container').toggleClass('loading');

      if (!config.getConfig().clientSecret) {
        window.alert('Please configure application first');
        $(document).trigger('ui:show:configModal');
      } else if (_.isEmpty(config.getRepos())) {
        window.alert('Please add repository first');
        $(document).trigger('ui:show:configModal');
      } else {
        $(document).trigger('ui:needs:columns');
      }

      $(document).on('ui:show:messageFailConnection', function (event) {
        $.unblockUI();
        $('#failConnectionModal').modal('toggle');
      });

      $('#redirectToPublicBtn').click(function () {
        var token = window.location.hash.slice(1);

        window.location = '/?access=repo#' + token;
      }.bind(this));

      // Message is sent by Github login popup
      window.addEventListener('message', function (event) {
        var code = event.data;
        $.getJSON('request_auth_token?code=' + code, function (res) {
          config.set('token', res.token);
          $.cookie('token', res.token, { expires: new Date(Date.now() + 3600000) } );
          $(document).trigger('ui:needs:columns');
        });
      });
    }
  });
