const Employee = require("../scripts/employee");

class Manager extends Employee {
    constructor(name, id, email, officeNumber){
        super(name, id, email);
        this.name = name; 
        this.id = id;
        this.email = email; 
        this.officeNumber = officeNumber; 
        this.role = 'Manager'; 
    }
}

Manager.prototype.getRole = function() {
    return this.role; 
}

Manager.prototype.getOfficeNumber = function() {
    return this.officeNumber; 
}

module.exports = Manager;