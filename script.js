"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelled = [];

const Student = {
  name: "",
  bloodStatus: "",
  prefect: "",
  inquisatorialSquad: "",
  house: "",
};

function start() {
  loadJSON();
}

async function loadJSON() {
  const url = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(url);
  const studentData = await response.json();

  prepareData(studentData);
}

function prepareData(studentData) {
  allStudents = studentData.map(prepareObject);

  buildList();
}

function prepareObject(studentObject) {
  const student = Object.create(Student);

  student.name = studentObject.fullname;
  student.house = studentObject.house;
  student.gender = studentObject.gender;
  student.prefect = Student.prefect;
  student.bloodStatus = Student.bloodStatus;
  student.inquisatorialSquad = Student.inquisatorialSquad;

  return student;
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";

  students.forEach(displayData);
}

function displayData(student) {
  const clone = document.querySelector("template.students").content.cloneNode(true);

  clone.querySelector(".names").textContent = student.name;

  document.querySelector("#list tbody").appendChild(clone);
}

function statistics() {
  const totalNumber = document.querySelector(".total");
  totalNumber.textContent = `Total number of current students: ${allStudents.length}`;

  //total number of students expelled
}

function hackTheSystem() {}

//find ud af senere hvornår den her funktion skal blive kaldt
statistics();
