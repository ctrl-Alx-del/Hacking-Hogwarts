"use strict";

window.addEventListener("DOMContentLoaded", start);

//arrays
let allStudents = [];
let expelledStudents = [];
let prefects = [];

//houses
let gryffindor = [];
let slytherin = [];
let hufflepuff = [];
let ravenclaw = [];

//settings
const settings = {
  chosenFilter: "All",
  sortDir: "asc",
  sortBy: "",
};

//Student class
const Student = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  bloodStatus: "",
  prefect: false,
  inquisatorialSquad: false,
  house: "",
  expelled: false,
  picture: "",
};

function start() {
  loadJSON();

  loadBloodStatsJSON();

  //making the houses selection clickable
  document.querySelectorAll(".option").forEach((eachButton) => {
    eachButton.addEventListener("click", dataFilter);
  });

  //making sorting table headers clickable
  document.querySelectorAll("[data-action='sort']").forEach((eachButton) => {
    eachButton.addEventListener("click", selectSort);
  });
}

async function loadJSON() {
  const url = "https://petlatkea.dk/2021/hogwarts/students.json";
  const response = await fetch(url);
  const studentData = await response.json();

  prepareData(studentData);
}

async function loadBloodStatsJSON() {
  const url = "https://petlatkea.dk/2021/hogwarts/families.json";
  const response = await fetch(url);
  const bloodData = await response.json();

  sendData(bloodData);
}

function sendData(blood) {
  for (let i = 0; i < allStudents.length; i++) {
    let eachStudent = allStudents[i];
    //Runs these function everytime it loops, not the most efficient, but it works for now...
    prepareBloodStats(blood, eachStudent);
  }

  buildList();
}

function prepareBloodStats(blood, student) {
  const half = blood.half;
  const pure = blood.pure;

  for (let i = 0; i < pure.length; i++) {
    //checks if the student has the same name as a pure blood
    if (student.lastName === pure[i]) {
      student.bloodStatus = "Pure blood";
    }
  }

  for (let i = 0; i < half.length; i++) {
    if (student.lastName === half[i]) {
      student.bloodStatus = "Half-blood";
    }
  }
}

function prepareData(studentData) {
  allStudents = studentData.map(prepareObject);

  buildList();
}

function prepareObject(studentObject) {
  const student = Object.create(Student);

  student.firstName = cleanUpNames(studentObject).firstName;
  student.middleName = cleanUpNames(studentObject).middleName;
  student.nickName = cleanUpNames(studentObject).nickName;
  student.lastName = cleanUpNames(studentObject).lastNameCleaned;
  student.house = cleanUpHouses(studentObject);
  student.picture = picturesAdded(studentObject);
  student.gender = studentObject.gender;
  student.prefect = Student.prefect;
  student.bloodStatus = Student.bloodStatus;
  student.inquisatorialSquad = Student.inquisatorialSquad;
  student.expelled = Student.expelled;

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

    //code to remove "" anførselstegn from the names
    // if (middleName.indexOf('"') === 0) {
    //   middleName = middleName.slice(1, middleName.lastIndexOf('"'));
    // }

    let nickName;

    if (middleName.indexOf('"') === 0) {
      nickName = middleName;
      middleName = "";
    }

    if (nickName === undefined) {
      nickName = "";
    }

    if (middleName.length === 0) {
      middleName = "";
    } else {
      middleName = middleName.charAt(0).toUpperCase() + middleName.slice(1);
    }

    return {
      firstName,
      middleName,
      nickName,
      lastNameCleaned,
    };
  }

  function picturesAdded(studentData) {
    const nameTrimmed = studentData.fullname.trim();
    const splitNames = nameTrimmed.split(" ");

    if (splitNames.length >= 2) {
      let lastName = splitNames.pop();
      let firstName = splitNames.shift();
      lastName = lastName.toLowerCase();
      firstName = firstName.charAt(0).toLowerCase();
      const namesAdded = `${lastName}_${firstName}.png`;

      return namesAdded;
    }
  }

  return student;
}

function buildList() {
  const currentList = filterHouse(allStudents);
  const sortedList = sorting(currentList);

  displayList(sortedList);

  statistics();
}

//filtering
function filterHouse(theFilteredList) {
  if (settings.chosenFilter === "Gryffindor") {
    theFilteredList = allStudents.filter(isGryffindor);
  } else if (settings.chosenFilter === "Hufflepuff") {
    theFilteredList = allStudents.filter(isHufflepuff);
  } else if (settings.chosenFilter === "Ravenclaw") {
    theFilteredList = allStudents.filter(isRavenclaw);
  } else if (settings.chosenFilter === "Slytherin") {
    theFilteredList = allStudents.filter(isSlytherin);
  } else if (settings.chosenFilter === "expelled") {
    theFilteredList = expelledStudents.filter(isExpelled);
  }

  return theFilteredList;
}

function isExpelled(student) {
  if (student.expelled === true) {
    return true;
  }
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  }
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  }
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";

  students.forEach(displayData);
}

function displayData(student) {
  const clone = document.querySelector("template.students").content.cloneNode(true);

  clone.querySelector("[data-student='names']").textContent = `${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;
  clone.querySelector("[data-student='house']").textContent = student.house;
  //popup clickable
  clone.querySelector(".studentRow").addEventListener("click", popUp);

  //changes the background color depending on which house it is
  if (student.house === "Hufflepuff") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "yellow";
  } else if (student.house === "Gryffindor") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "red";
  } else if (student.house === "Ravenclaw") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "rgb(87, 87, 255)";
  } else if (student.house === "Slytherin") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "green";
  }

  //Displays the bloodstatus of each student
  if (student.bloodStatus === "Pure blood") {
    clone.querySelector(".bloodStatus").textContent = "Pure blood";
  } else if (student.bloodStatus === "Half-blood") {
    clone.querySelector(".bloodStatus").textContent = "Half-blood";
  } else if (student.bloodStatus === "") {
    clone.querySelector(".bloodStatus").textContent = "Unknown";
  }

  //Displays prefects
  if (student.prefect === true) {
    clone.querySelector(".prefects").textContent = "Prefect";
  } else {
    clone.querySelector(".prefects").textContent = "";
  }

  //Displays if the student is a member of the inquisitorial squad or not
  if (student.inquisatorialSquad === true) {
    clone.querySelector("[data-student='inquisatorialSquad']").textContent = "Member";
  } else {
    clone.querySelector("[data-student='inquisatorialSquad']").textContent = "";
  }

  //popUp
  function popUp() {
    const popUpDisplay = document.querySelector(".popUp");
    popUpDisplay.style.display = "flex";

    const firstName = document.querySelector(".innerPopUp > p:nth-child(1)");
    const middleName = document.querySelector(".innerPopUp > p:nth-child(2)");
    const nickName = document.querySelector(".innerPopUp > p:nth-child(3)");
    const lastName = document.querySelector(".lastName");
    const profilePic = document.querySelector(".picture");
    const crests = document.querySelector(".crests");

    crests.src = `images/crests/${student.house}.png`;

    if (student.house === "Gryffindor") {
      crests.classList.remove("ravenclaw");
      crests.classList.remove("hufflepuff");
      crests.classList.remove("slytherin");
      crests.classList.add("gryffindor");
    } else if (student.house === "Slytherin") {
      crests.classList.remove("ravenclaw");
      crests.classList.remove("hufflepuff");
      crests.classList.remove("gryffindor");
      crests.classList.add("slytherin");
    } else if (student.house === "Hufflepuff") {
      crests.classList.remove("ravenclaw");
      crests.classList.remove("slytherin");
      crests.classList.remove("gryffindor");
      crests.classList.add("hufflepuff");
    } else if (student.house === "Ravenclaw") {
      crests.classList.remove("hufflepuff");
      crests.classList.remove("slytherin");
      crests.classList.remove("gryffindor");
      crests.classList.add("ravenclaw");
    }

    profilePic.src = `images/${student.picture}`;

    firstName.textContent = `First name: ${student.firstName}`;
    if (student.middleName === "") {
      middleName.textContent = "";
    } else {
      middleName.textContent = `Middle name: ${student.middleName}`;
    }

    if (student.nickName === "") {
      nickName.textContent = "";
    } else {
      middleName.textContent = `Nickname: ${student.nickName}`;
    }

    lastName.textContent = `Last name: ${student.lastName}`;

    const exitButton = document.querySelector(".exit");
    exitButton.addEventListener("click", exitPopUp);

    function exitPopUp() {
      popUpDisplay.style.display = "none";

      prefectBtn.forEach((button) => {
        button.removeEventListener("click", makePrefect);
      });

      const inqSquadBtn = document.querySelectorAll(".inqSquadBtn");
      inqSquadBtn.forEach((eachButton) => {
        eachButton.removeEventListener("click", inqSquad);
      });

      const exitButton = document.querySelector(".exit");
      exitButton.removeEventListener("click", exitPopUp);
    }

    //Inquisitorial squad button added
    const inqSquadBtn = document.querySelector(".inqSquadBtn");
    if (student.house === "Slytherin" && student.bloodStatus === "Pure blood") {
      inqSquadBtn.style.display = "block";
    } else {
      inqSquadBtn.style.display = "none";
    }

    const expelButtons = document.querySelectorAll(".expel");
    expelButtons.forEach((eachButton) => {
      eachButton.addEventListener("click", expel);
    });

    //removes the fade so it doesn't occur everytime you open a new popup
    popUpDisplay.classList.remove("expelledFromHogwarts");

    //work in progress!!!
    function expel() {
      const nameOfStudent = student.firstName;

      const indexOfStudent = allStudents.map((element) => element.firstName).indexOf(nameOfStudent);

      //Note that we use [0] to get the first (and only) element of the array returned by splice(), which is the removed student.
      const expelledStudent = allStudents.splice(indexOfStudent, 1)[0];
      expelledStudents.push(expelledStudent);

      popUpDisplay.classList.add("expelledFromHogwarts");
      popUpDisplay.addEventListener("animationend", () => {
        popUpDisplay.style.display = "none";
      });

      //removes the eventlistener when you click expel, so it won't count twice next time you click.
      expelButtons.forEach((eachButton) => {
        eachButton.removeEventListener("click", expel);
      });

      //sets the key value of expelled to true
      student.expelled = true;

      buildList();
    }

    const allInqSquadBtns = document.querySelectorAll(".inqSquadBtn");
    allInqSquadBtns.forEach((eachButton) => {
      eachButton.addEventListener("click", inqSquad);
    });

    const prefectBtn = document.querySelectorAll(".prefect");
    prefectBtn.forEach((button) => {
      button.addEventListener("click", makePrefect);
    });
  }

  function makePrefect() {
    //(prefect) Student can be made/toggled as prefect so	Only two pr. House

    let isPrefect = allStudents.filter((student) => student.prefect === true);
    let prefectCount = isPrefect.length;

    //Checks if the one you selected as prefect is the same gender
    let isSameGender = (element) => element.gender === student.gender;
    let onlyOneGender = isPrefect.some(isSameGender);

    if ((prefectCount < 2 && !onlyOneGender) || student.prefect) {
      student.prefect = !student.prefect;
    } else {
      student.prefect === false;
    }

    buildList();
  }

  function inqSquad() {
    student.inquisatorialSquad = !student.inquisatorialSquad;

    buildList();
  }

  document.querySelector("#list tbody").appendChild(clone);
}

function statistics() {
  //total number of students at, except expelled ones
  const totalNumber = document.querySelector(".total");
  totalNumber.textContent = `Total number of current students: ${allStudents.length}`;

  //total number of students expelled
  const expelNum = document.querySelector(".numExpelled");
  expelNum.textContent = `Number of expelled students: ${expelledStudents.length}`;

  //Number of students displayed. May have to be modified when you get to filter expelled students and all the others
  const numbersDisplayed = Number(filterHouse(allStudents).length);
  const displayContainer = document.querySelector(".displayed");
  displayContainer.textContent = `Number of students displayed: ${numbersDisplayed}`;

  //make an array for each house and put students into that and read their length
  gryffindor = allStudents.filter(isGryffindor);
  slytherin = allStudents.filter(isSlytherin);
  hufflepuff = allStudents.filter(isHufflepuff);
  ravenclaw = allStudents.filter(isRavenclaw);

  const totalGryf = gryffindor.length;
  const totalRaven = ravenclaw.length;
  const totalHuff = hufflepuff.length;
  const totalSlyth = ravenclaw.length;

  //students pr. house
  const studentsPrHouse = document.querySelector(".prHouse");
  studentsPrHouse.innerHTML = `<p>Gryffindor: ${totalGryf}</p> <p>Slytherin: ${totalSlyth}</p> 
  <p>Hufflepuff: ${totalHuff}</p> <p>Ravenclaw: ${totalRaven}`;
}

function sorting(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else if (studentA[settings.sortBy] > studentB[settings.sortBy]) {
      return 1 * direction;
    } else {
      return 0;
    }
  }

  return sortedList;
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //toggle direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  buildList();
}

function dataFilter(event) {
  const filter = event.target.value;

  setFilter(filter);
}

function setFilter(filterBy) {
  settings.chosenFilter = filterBy;

  buildList();
}

function search() {
  let input = document.querySelector(".input").value;
  input = input.toLowerCase();

  let studentNames = document.getElementsByClassName("names");
  let bloodStatus = document.getElementsByClassName("bloodStatus");
  let house = document.getElementsByClassName("house");
  let prefects = document.getElementsByClassName("prefects");
  let inquisatorialSquad = document.getElementsByClassName("inquisatorialSquad");

  for (let i = 0; i < studentNames.length; i++) {
    if (!studentNames[i].innerHTML.toLowerCase().includes(input)) {
      studentNames[i].style.display = "none";
      bloodStatus[i].style.display = "none";
      house[i].style.display = "none";
      prefects[i].style.display = "none";
      inquisatorialSquad[i].style.display = "none";
    } else {
      studentNames[i].style.display = "block";
      bloodStatus[i].style.display = "block";
      house[i].style.display = "block";
      prefects[i].style.display = "block";
      inquisatorialSquad[i].style.display = "block";
    }
  }
}

function hackTheSystem() {}
