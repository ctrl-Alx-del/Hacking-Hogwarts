"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelled = [];
//houses
let gryffindor = [];
let slytherin = [];
let hufflepuff = [];
let ravenclaw = [];

const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
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

  student.firstName = cleanUpNames(studentObject).firstName;
  student.middleName = cleanUpNames(studentObject).middleName;
  student.lastName = cleanUpNames(studentObject).lastNameCleaned;
  student.house = cleanUpHouses(studentObject);
  student.gender = studentObject.gender;
  student.prefect = Student.prefect;
  student.bloodStatus = Student.bloodStatus;
  student.inquisatorialSquad = Student.inquisatorialSquad;

  //makes the data more readable
  function cleanUpHouses(studentData) {
    const house = studentData.house.trim();
    const houseCleaned = house.charAt(0).toUpperCase() + house.slice(1).toLowerCase();
    return houseCleaned;
  }

  //makes the data more readable
  function cleanUpNames(studentData) {
    const name = studentData.fullname.trim();
    const splitName = name.split(" ");
    const firstName = splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1).toLowerCase();

    const lastName = splitName.pop();
    let lastNameCleaned = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    lastNameCleaned = lastNameCleaned
      .split("-")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("-");

    //middle name data cleaned
    const nameSplitted1 = studentObject.fullname.trim();
    let nameSplitted2 = nameSplitted1.indexOf(" ");
    if (studentObject.fullname.indexOf(" ") === 0) {
      //Some weird bug where it took the index right before what it should be. So i just added 1 more to move and fix it.
      nameSplitted2 = nameSplitted2 + 1;
    }
    const nameSplitted3 = studentObject.fullname.lastIndexOf(" ");
    let middleName = studentObject.fullname.substring(nameSplitted2, nameSplitted3);
    middleName = middleName.trim();

    if (middleName.indexOf('"') === 0) {
      middleName = middleName.slice(1, middleName.lastIndexOf('"'));
    }

    if (middleName.length === 0) {
      middleName = "";
    } else {
      middleName = middleName.charAt(0).toUpperCase() + middleName.slice(1);
    }

    return {
      firstName,
      middleName,
      lastNameCleaned,
    };
  }

  return student;
}

function buildList() {
  const currentList = allStudents;
  displayList(currentList);

  statistics();
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";

  students.forEach(displayData);
}

function displayData(student) {
  const clone = document.querySelector("template.students").content.cloneNode(true);

  clone.querySelector("[data-student='names']").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  clone.querySelector(".house").textContent = student.house;
  //popup clickable
  clone.querySelector(".studentRow").addEventListener("click", popUp);

  if (student.house === "Hufflepuff") {
    clone.querySelector(".house").style.backgroundColor = "yellow";
  } else if (student.house === "Gryffindor") {
    clone.querySelector(".house").style.backgroundColor = "red";
  } else if (student.house === "Ravenclaw") {
    clone.querySelector(".house").style.backgroundColor = "blue";
  } else if (student.house === "Slytherin") {
    clone.querySelector(".house").style.backgroundColor = "green";
  }

  document.querySelector("#list tbody").appendChild(clone);
}

function statistics() {
  //total number of students at, except expelled ones
  const totalNumber = document.querySelector(".total");
  totalNumber.textContent = `Total number of current students: ${allStudents.length}`;

  //students pr. house
  const studentsPrHouse = document.querySelector(".prHouse");
  studentsPrHouse.textContent = `Number of students pr. house:`;

  //total number of students expelled

  //Number of students displayed

  //make an array for each house and put students into that and read their length
  function calcHouses() {
    // if(student.house === gryffindor){
    // }
  }
}

function hackTheSystem() {}

function popUp(event) {
  const popUpDisplay = document.querySelector(".popUp");
  popUpDisplay.style.display = "flex";

  const elementClicked = this;

  console.log(elementClicked);

  const firstName = document.querySelector(".innerPopUp > p:nth-child(1)");
  const house = document.querySelector(".innerPopUp > img:nth-child(2)");

  firstName.textContent = `First name: ${elementClicked.cells[0].innerText}`;
  //   house.src = elementClicked.cells[4].innerText;

  const exitButton = document.querySelector(".exit");
  exitButton.addEventListener("click", exitPopUp);

  function exitPopUp() {
    popUpDisplay.style.display = "none";
  }
}
