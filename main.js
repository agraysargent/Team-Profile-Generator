const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const timestamp = require("./lib/timestamp");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const validate = {
  required: (input) => (input !== "" ? true : "This is section is required."),
  name: (input) => (input !== "" ? true : "Please enter a name."),
  id: (input) =>
    Number.isInteger(Number(input)) && Number(input) > 0
      ? true
      : "Please enter a whole number.",
  email: (input) =>
    input.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+\@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi
    )
      ? true
      : "Please enter your email address.",
};

const questions = {
  type: function () {
    return {
      message: "Which team member would you like to add?",
      type: "list",
      name: "member",
      choices: ["Engineer", "Intern", "Manager", "None"],
    };
  },
};

let employees = [];

async function addRole(member) {
  let { name } = await inquirer.prompt(
    questions.item(member, "name", "full name", validate.name)
  );
  let { id } = await inquirer.prompt(
    questions.item(member, "id", "ID number", validate.id)
  );
  let { email } = await inquirer.prompt.apply(
    questions.item(member, "email", "email address", validate.email)
  );
  switch (member) {
    case "Engineer":
      let { github } = await inquirer.prompt(
        questions.item(member, "github", "Github username", validate.required)
      );
      employees.push(new Manager(name, id, email, github));
      break;
    case "Intern":
      let { school } = await inquirer.prompt(
        questions.item(member, "school", "email", validate.required)
      );
      employees.push(new Manager(name, id, email, school));
      break;
    case "Manager":
      let { officeNumber } = await inquirer.prompt(
        questions.item(
          member,
          "officeNumber",
          "office telephone",
          validate.required
        )
      );
      employees.push(new Manager(name, id, email, officeNumber));
      break;
  }
}

function getHTMLModule(file) {
  return readFile(file, "utf8");
}

async function generateHTML() {
  let Template = {
    Main: await getHTMLModule("./templates/main.html"),
    Engineer: await getHTMLModule("./templates/engineer.html"),
    Intern: await getHTMLModule("./templates/intern.html"),
    Manager: await getHTMLModule("./templates/manager.html"),
  };
}

let employees = "";
// utilized w3 schools to generate below

for (let employee of employees) {
  let html = Template[employee.constructor.name]
    .replace(/{% name %}/gi, employee.name)
    .replace(/{% id %}/gi, employee.id)
    .replace(/{% email %}/gi, employee.email);
  switch (employee.constructor.name) {
    case "Engineer":
      html = html.replace(/{% github %}/gi, employee.github);
      break;
    case "Intern":
      html = html.replace(/{% school %}/gi, employee.school);
      break;
    case "Manager":
      html = html.replace(/{% officeNumber %}/gi, employee.officeNumber);
      break;
  }
  employeesHTML += html;
}
let completeHTML = Template["Main"].replace(/{% employees %}/gi, employeesHTML);
createHTML(completeHTML);

async function createHTML(html) {
  console.log("HTML Complete");
  let file = "team-${timestamp()}.html";
  let dir = "./output";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  await writeFile(`${dir}/${file}`, html);
  console.log(`HTML has been created to "${dir}/${file}".`);
  return;
}

async function init() {
    console.log("Please build your team");
    await addRole("Manager");
    let member = "";
    let exit = "I don't want to add anymore team members";
    while (member != exit) {
        let { member } = await inquirer.prompt(questions.type());
        if (member === exit) {
            return generateHTML();
        }
        await addRole(member);
    }
}

init();