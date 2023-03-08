"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelled = [];

//houses
let gryffindor = [];
let slytherin = [];
let hufflepuff = [];
let ravenclaw = [];

const settings = {
  chosenFilter: "All",
  sortDir: "asc",
  sortBy: "",
};

const Student = {
  firstName: "",
  middleName: "",
  nickName: "",
  lastName: "",
  bloodStatus: "",
  prefect: "none",
  inquisatorialSquad: "",
  house: "",
  expelled: "not",
  picture: "",
};

function start() {
  loadJSON();

  document.querySelectorAll(".option").forEach((eachButton) => {
    eachButton.addEventListener("click", dataFilter);
  });
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

  displayList(currentList);

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
  }

  return theFilteredList;
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

  if (student.house === "Hufflepuff") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "yellow";
  } else if (student.house === "Gryffindor") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "red";
  } else if (student.house === "Ravenclaw") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "rgb(87, 87, 255)";
  } else if (student.house === "Slytherin") {
    clone.querySelector("[data-student='house']").style.backgroundColor = "green";
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
    }
  }

  document.querySelector("#list tbody").appendChild(clone);
}

function statistics() {
  //total number of students at, except expelled ones
  const totalNumber = document.querySelector(".total");
  totalNumber.textContent = `Total number of current students: ${allStudents.length}`;

  //total number of students expelled

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

function hackTheSystem() {}

function search(student) {
  const searchBar = document.querySelector(".input");
  searchBar.addEventListener("input", (element) => {
    let value = element.target.value;

    const eachStudent = student.forEach((element) => {
      const firstName = element.firstName;
    });
  });
}

function sorting() {}

function dataFilter(event) {
  const filter = event.target.value;

  setFilter(filter);
}

function setFilter(filterBy) {
  settings.chosenFilter = filterBy;

  buildList();
}
