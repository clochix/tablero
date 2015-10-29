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
  'component/templates/repo_input_template',
  'config/config_bootstrap'
  ],
  function (defineComponent, repoInputTemplate, config) {
    'use strict';

    return defineComponent(configModal, repoInputTemplate);

    function configModal() {
      this.defaultAttrs({
        reposContainerSelector: '.columns-container'
      });
      this.showModal = function () {
        this.$node.modal({
          backdrop: 'static',
          keyboard: false
        });
      };

      this.addNewRepo = function () {
        var reposContainer = this.$node.find(this.attr.reposContainerSelector);
        reposContainer.append(this.renderRepoInput(''));
      };

      this.saveConfig = function () {
        var reposContainer = this.$node.find(this.attr.reposContainerSelector),
            data = {},
            repos = _.chain(reposContainer.find('input')).
        filter(function (input) {
          return !_.isEmpty(input.value);
        }).
        map(function (input, index) {
          return input.value;
        }).
        value();
        data = {
          clientId: this.$node.find('#clientId')[0].value,
          clientSecret: this.$node.find('#clientSecret')[0].value,
          repos: repos
        };
        $(document).trigger('data:store:config', data);
        this.$node.modal('hide');
      };

      this.removeRepo = function (event, repo) {
        $(repo).remove();
      };

      this.changeConfigEvents = function () {
        $('#changeConfig').click(function () {
          $(document).trigger('ui:show:configModal');
        });
      };

      this.addRepoEvent = function () {
        $('#addRepo').click(function () {
          $(document).trigger('ui:show:addRepo');
        });
      };

      this.saveConfigChanges = function () {
        $('#saveConfigChanges').click(function () {
          $(document).trigger('ui:show:saveConfig');
        });
      };

      this.bindRemoveRepoEvents = function () {
        $('a.remove-repo').click(function () {
          $(document).trigger('ui:show:removeRepo', $(this).parent());
        });
      };

      this.setUp = function () {
        var conf = config.getConfig(),
            that = this;
        this.changeConfigEvents();
        this.addRepoEvent();
        this.saveConfigChanges();
        this.$node.find('#clientId')[0].value = conf.clientId || '';
        this.$node.find('#clientSecret')[0].value = conf.clientSecret || '';
        this.$node.find(this.attr.reposContainerSelector).html('');
        _.each(conf.repos, function (repo) {
          var repoInput = that.renderRepoInput(repo);
          this.append(repoInput);
        }, this.$node.find(this.attr.reposContainerSelector));

      };

      this.after('initialize', function () {
        this.setUp();
        this.on(document, 'ui:show:configModal', this.showModal.bind(this));
        this.on(document, 'ui:show:configModal', this.bindRemoveRepoEvents);
        this.on(document, 'ui:show:addRepo', this.addNewRepo.bind(this));
        this.on(document, 'ui:show:saveConfig', this.saveConfig.bind(this));
        this.on(document, 'ui:show:removeRepo', this.removeRepo.bind(this));
      });
    }
  });
