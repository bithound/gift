// Generated by CoffeeScript 1.6.3
(function() {
  var Commit, Head, Ref, fs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  Commit = require('./commit');

  exports.Ref = Ref = (function() {
    function Ref(name, commit) {
      this.name = name;
      this.commit = commit;
      this.repo = this.commit.repo;
    }

    Ref.prototype.toString = function() {
      return "#<Ref '" + this.name + "'>";
    };

    Ref.find_all = function(repo, type, RefClass, callback) {
      return repo.git.refs(type, {}, function(err, text) {
        var id, ids, name, names, ref, _i, _len, _ref, _ref1;
        if (err) {
          return callback(err);
        }
        names = [];
        ids = [];
        _ref = text.split("\n");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ref = _ref[_i];
          if (!ref) {
            continue;
          }
          _ref1 = ref.split(' '), name = _ref1[0], id = _ref1[1];
          names.push(name);
          ids.push(id);
        }
        return Commit.find_commits(repo, ids, function(err, commits) {
          var i, refs, _j, _len1;
          if (err) {
            return callback(err);
          }
          refs = [];
          for (i = _j = 0, _len1 = names.length; _j < _len1; i = ++_j) {
            name = names[i];
            refs.push(new RefClass(name, commits[i]));
          }
          return callback(null, refs);
        });
      });
    };

    return Ref;

  })();

  exports.Head = Head = (function(_super) {
    __extends(Head, _super);

    function Head() {
      _ref = Head.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Head.find_all = function(repo, callback) {
      return Ref.find_all(repo, "head", Head, callback);
    };

    Head.current = function(repo, callback) {
      return fs.readFile("" + repo.dot_git + "/HEAD", function(err, data) {
        var branch, m, _ref1;
        if (err) {
          return callback(err);
        }
        _ref1 = /ref: refs\/heads\/([^\s]+)/.exec(data), m = _ref1[0], branch = _ref1[1];
        return fs.readFile("" + repo.dot_git + "/refs/heads/" + branch, function(err, id) {
          return Commit.find(repo, id, function(err, commit) {
            if (err) {
              return callback(err);
            }
            return callback(null, new Head(branch, commit));
          });
        });
      });
    };

    return Head;

  })(Ref);

}).call(this);
