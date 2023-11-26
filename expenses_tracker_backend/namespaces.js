const debug = require("debug");
class Namespace {
  constructor(namespace_name, parent_namespace = null) {
    this.namespace_name = namespace_name;
    this.parent = parent_namespace;
  }
  getName() {
    if (this.parent) return `${this.parent.getName()}:${this.namespace_name}`;
    return `${this.namespace_name}`;
  }

  addParentNamespace(namespace) {
    this.parent = namespace;
    return this;
  }

  createNewNamespace(namespaceName) {
    return new Namespace(namespaceName, this);
  }

  join(namespaceName) {
    return this.createNewNamespace(namespaceName);
  }

  getErrorNamespace() {
    return new Namespace("error", this);
  }

  getStackNamespace() {
    return new Namespace("stackTrace", this);
  }

  getWarningNamespace() {
    return new Namespace("warning", this);
  }

  log(...args) {
    debug(this.getName())(...args);
    return this;
  }

  logErr(...args) {
    debug(this.getErrorNamespace().getName())(...args);
    return this;
  }

  logStack(...args) {
    debug(this.getStackNamespace().getName())(...args);
  }
  logWarn(...args) {
    debug(this.getWarnNamespace().getName())(...args);
    return this;
  }
}
module.exports = Namespace;
