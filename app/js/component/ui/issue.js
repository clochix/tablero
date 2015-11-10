define(
  ['flight/lib/component'],
  function (defineComponent) {
    "use strict";
    return defineComponent(issue);

    function issue() {
      this.hideIssue = function (ev, data) {
        if (this.attr.issue.repoName === data.repo) {
          this.$node.hide();
        }
      };
      this.showIssue = function (ev, data) {
        if (this.attr.issue.repoName === data.repo && this.attr.issue.state === "open" )  {
          this.$node.show();
        }
      };
      this.after('initialize', function () {
        this.$node.find('.issue-body').click(function () {
          $(document).trigger('ui:needs:issue', this.attr.issue);
        }.bind(this));
        this.on(document, 'ui:dontShowRepoIssues', this.hideIssue);
        this.on(document, 'ui:showRepoIssues', this.showIssue);
      });
    }
  }
);
