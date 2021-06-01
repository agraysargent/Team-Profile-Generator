const Intern = require("../scripts/intern");

test("Can set school via constructor", () => {
  const testValue = "UCONN";
  const e = new Intern("Radam", 1, "test@test.com", testValue);
  expect(e.school).toBe(testValue);
});

test("getRole() should return \"Intern\"", () => {
  const testValue = "Intern";
  const e = new Intern("Radam", 1, "test@test.com", "UCONN");
  expect(e.getRole()).toBe(testValue);
});

test("Can get school via getSchool()", () => {
  const testValue = "UCONN";
  const e = new Intern("Radam", 1, "test@test.com", testValue);
  expect(e.getSchool()).toBe(testValue);
});