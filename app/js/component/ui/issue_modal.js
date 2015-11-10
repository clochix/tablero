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
define([
  'flight/lib/component',
  'config/config_bootstrap'
  ],
  function (defineComponent, config) {
    'use strict';

    return defineComponent(issueModal);

    function issueModal() {
      this.showModal = function (event, issue) {
        console.log('showModal', issue);
        this.currentIssue = issue;
        this.node.querySelector('.modal-title').innerHTML = issue.title;
        this.node.querySelector('.modal-body').innerHTML = this.template.render(issue);
        this.$node.modal({
          backdrop: 'static',
          keyboard: false
        });
      };

      this.addNewComment = function () {
        var comment = this.node.querySelector('.newComment textarea').value.trim();
        if (comment) {
          $(document).trigger('data:create:comment', {issue: this.currentIssue, comment: comment});
        }
      };

      this.setUp = function () {
        this.template = Hogan.compile(document.getElementById('issueDetail').innerHTML);
        $('#addComment').click(function () {
          this.addNewComment();
        }.bind(this));
      };

      this.after('initialize', function () {
        this.setUp();
        this.on(document, 'data:got:issue', this.showModal.bind(this));
      });
    }
  });
