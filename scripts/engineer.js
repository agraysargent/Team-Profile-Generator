const Employee = require("../scripts/employee");

class Engineer extends Employee {
  constructor(name, id, email, gitHub) {
    super(name, id, email);
    this.name = name;
    this.id = id;
    this.email = email;
    this.gitHub = gitHub;
    this.role = "Engineer";
  }
}

Engineer.prototype.getGithub = function () {
  return this.gitHub;
};

module.exports = Engineer;
