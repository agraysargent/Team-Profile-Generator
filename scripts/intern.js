const Employee = require("../scripts/employee");

class Intern extends Employee {
  constructor(name, id, email, school) {
    super(name, id, email);
    this.name = name;
    this.id = id;
    this.email = email;
    this.school = school;
    this.role = "Intern";
  }
}

Intern.prototype.getSchool = function () {
  return this.school;
};

module.exports = Intern;
