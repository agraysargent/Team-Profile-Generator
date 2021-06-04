const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const timestamp = require("./scripts/generate");
const Engineer = require("./scripts/engineer");
const Intern = require("./scripts/intern");
const Manager = require("./scripts/manager");

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

async function addRole() {
  let data = await inquirer.prompt([
    {
      type: "input",
      name: "employeeName",
      message: "what is the employee name? ",
    },
    {
      type: "input",
      name: "employeeId",
      message: "what is the employee id? ",
    },
    {
      type: "input",
      name: "email",
      message: "what is the employee email? ",
    },
    {
      type: "input",
      name: "role",
      message: "what is the employee role? ",
    },
  ]);

  return data;
}

function generateRoleHtml(data) {
  switch (data.role) {
    case "Engineer":
      let { github } = inquirer.prompt([
        {
          type: "input",
          name: "role",
          message: "what is the github username? ",
        },
      ]);
      employees.push(new Engineer(name, id, email, github));
      break;

    case "Intern":
      let { school } = inquirer.prompt([
        {
          type: "input",
          name: "role",
          message: "what school do they attend? ",
        },
      ]);
      employees.push(new Intern(name, id, email, school));
      break;

    case "Manager":
      let { officeNumber } = inquirer.prompt([
        {
          type: "input",
          name: "role",
          message: "what is their office number? ",
        },
      ]);
      employees.push(new Manager(name, id, email, officeNumber));
      break;
  }

  function getHTMLModule(file) {
    return readFile(file, "utf8");
  }

  async function generateHTML() {
    // let Template = {
    //   Main: await getHTMLModule("./templates/main.html"),
    //   Engineer: await getHTMLModule("./templates/engineer.html"),
    //   Intern: await getHTMLModule("./templates/intern.html"),
    //   Manager: await getHTMLModule("./templates/manager.html"),
    //
    console.log(employees);
  }

  function makeManagerHTML(Manager) {
    return `
  <h1>${Manager.name}</h1>, 
  <p>${Manager.id}</p>,
  <p>${Manager.email}</p>,
  <p>${Manager.officeNumber}</p>
  `;
  }

  function makeEmployeeHTML(Employee) {
    return `
  <h1>${Employee.name}</h1>
  <p>${Employee.id}</p>
  <p>${Employee.email}</p>
  `;
  }

  function makeInternHTML(Intern) {
    return `
  <h1>${Intern.name}</h1>
  <p>${Intern.id}<p>
  <p>${Intern.email}</p>
  <p>${Intern.school}</p>
  `;
  }

  function makeEngineerHTML(Engineer) {
    return `
  <h1>${Engineer.name}</h1>
  <p>${Engineer.id}<p>
  <p>${Engineer.email}</p>
  <p>${Engineer.github}</p>
  `;
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
    console.log(`HTML has been created to "${dir}/${file}".`)
    return;
  }

  async function init() {
    console.log("Please build your team");
    await addRole();
    let member = "";
    let exit = "I don't want to add anymore team members";
    while (member != exit) {
      let { member } = await inquirer.prompt(questions.type());
      if (member === exit) {
        return generateHTML();
      }
      await addRole(member);
    }
  };

init();