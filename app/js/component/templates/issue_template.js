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
define(['config/config_bootstrap'],
  function (config) {
    "use strict";
    return issueTemplate;

    function issueTemplate() {
      var repoNames = config.getReposNames();
      this.getRepoColor = function (projectName) {
        var idx = repoNames.indexOf(projectName);
        return 'color' + idx;
      };

      this.clearHuboardInfo = function (issue) {
        var clearedIssue, issueParts;
        clearedIssue = _.clone(issue);

        if (issue.body) {
          clearedIssue.body = issue.body.slice(0, issue.body.indexOf("<!---") - 2);
        }

        return clearedIssue;
      };

      this.getLabels = function (labels, columnLabelFilter) {
        return _.filter(labels, columnLabelFilter);
      };

      var columnLabelRegex = /\d+ - \w+/;

      this.removeColumnsLabels = function (labels) {
        return this.getLabels(labels, function (label) {
          return !(label.name.match(columnLabelRegex));
        });
      };

      this.getColumnLabel = function (labels) {
        return this.getLabels(labels, function (label) {
          return (label.name.match(columnLabelRegex));
        });
      };

      this.render = function (issue) {
        var renderedIssue;
        issue.repoName = issue.projectName;
        issue.colorClass = this.getRepoColor(issue.projectName);
        issue.labelsName = this.removeColumnsLabels(issue.labels);
        var columnLabel = this.getColumnLabel(issue.labels)[0];
        issue.kanbanState = columnLabel ? columnLabel.name : '';
        renderedIssue = this.template.render(this.clearHuboardInfo(issue));
        return renderedIssue;
      };

      this.before('initialize', function () {
        this.template = Hogan.compile(
          '<div class="issue list-group-item {{repoName}} {{colorClass}}" id="{{id}}" data-priority="{{priority}}">' +
          '<div class="issue-header">' +
          '<a class="assigns-myself">' +
          '<span class="empty-avatar">+</span>' +
          '<span class="empty-avatar-label">ASSIGN ME</span>' +
          '<img class="assignee-avatar" title="{{assignee.login}}" src="{{assignee.avatar_url}}" />' +
          '</a>' +
          '<a href="{{html_url}}" target="_blank"><span class="issue-number right">#{{number}}</span></a>' +
          '</div>' +
          '<div class="issue-body">' +
          '<a class="title list-group-item-heading" href="{{html_url}}" target="_blank" data-toggle="tooltip" title="{{body}}" data-hint="Ctrl+C to Copy">' +
          '{{title}}' +
          '</a>' +
          '</div>' +
          '<div class="labels">' +
          '{{#labelsName}}' +
          '<span class="label" style="background: #{{color}};">{{name}}</span>' +
          '{{/labelsName}}' +
          '</div>' +
          '</div>'
        );
      });
    }
  }
);
