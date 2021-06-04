const Engineer = require("../scripts/Engineer");
const Intern = require("../scripts/Intern");
const Manager = require("../scripts/Manager");
const fs = require("fs");
const { off } = require("process");


class Template {
  constructor(name, id, email, totalCards){
    this.name = name;
    this.id = id;
    this.email = email;
    this.totalCards = totalCards;
  }

module.exports = Template;