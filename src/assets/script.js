
function addEventListenersInp(number) {
 const inputBtn = document.getElementById(`introdu${number}`);
 inputBtn.addEventListener("click", () => {
  addValueToList(number)
 })
}

for (let i = 1; i < 8; i++) {
 addEventListenersInp(i);
}

const table = document.getElementById("teams");
function populateTable(value) {
 const table = document.getElementById('teams');
 const emptyPosition = findFirstEmptyPosition();

 if (emptyPosition) {
  const { row, column } = emptyPosition;
  const cell = table.rows[row].cells[column];

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-button');

  cell.innerHTML = '';
  cell.textContent = value;
  cell.appendChild(deleteIcon);
 }
}

const submitButton = document.getElementById("button_selectPlayer");
submitButton.addEventListener("click", function () {
 const input = document.getElementById("input_selectPlayer");
 const selectedValue = input.value;
 populateTable(selectedValue);
});


// Function to measure the length of non-null <li> elements within a <ul> element
export function countNonNullLi(ulElement) {
 const liElements = ulElement.querySelectorAll('li');
 let count = 0;

 liElements.forEach(li => {
  if (li.textContent.trim() !== '') {
   count++;
  }
 });

 return count;
}

export var clasament = [
 {
  'culoare': 'Verde', 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0,
 },
 {
  'culoare': `Portocaliu`, 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0,
 },
 {
  'culoare': `Albastru`, 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0,
 },
 {
  'culoare': `Gri`, 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0
 },
]

function getMatchInformations(match) {
 //console.log(`inside children ${match.children[1]}`)

 const leftTeamName = match.children[0].children[0].children[0].textContent.trim();
 const rightTeamName = match.children[0].children[2].children[0].textContent.trim();
 const score = match.children[0].children[1].textContent

 return [leftTeamName, rightTeamName, score];
}



function updateClasament(match) {

 const matchInformations = getMatchInformations(match);
 const leftTeamName = matchInformations[0];
 const rightTeamName = matchInformations[1];
 const score = matchInformations[2];

 const scoreInt = score.split('-');
 const leftTeamGoals = parseInt(scoreInt[0]);
 const rightTeamGoals = parseInt(scoreInt[1]);

 const leftTeam = getTeam(leftTeamName);
 const rightTeam = getTeam(rightTeamName);

 const result = leftTeamGoals - rightTeamGoals;

 leftTeam.goluri_date += leftTeamGoals;
 leftTeam.goluri_primite += rightTeamGoals;
 leftTeam.golaveraj = leftTeam.goluri_date - leftTeam.goluri_primite;

 rightTeam.goluri_date += rightTeamGoals;
 rightTeam.goluri_primite += leftTeamGoals;
 rightTeam.golaveraj = rightTeam.goluri_date - rightTeam.goluri_primite;

 if (result == 0) {
  leftTeam.egaluri++;
  rightTeam.egaluri++;
  leftTeam.punctaj++;
  rightTeam.punctaj++;
 } else if (result < 0) {
  leftTeam.infrangeri++;
  rightTeam.victorii++;
  rightTeam.punctaj += 3;
 } else {
  leftTeam.victorii++;
  rightTeam.infrangeri++;
  leftTeam.punctaj += 3;
 }

 leftTeam.meciuri_jucate++;
 rightTeam.meciuri_jucate++;
}

const matches = document.querySelectorAll('.match');
matches.forEach(match => {
 const leftTeamGoalsUl = match.querySelector('.left-team-info ul');
 const rightTeamGoalsUl = match.querySelector('.right-team-info ul');

 const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
 const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

 const scoreElement = match.querySelector('.scor');
 scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;
 updateClasament(match);
}, this);


var clasamentSelectiv = [
 { 'culoare': 'Verde', 'vs_Portocaliu': 0, 'vs_Albastru': 0, 'vs_Gri': 0 },
 { 'culoare': 'Portocaliu', 'vs_Verde': 0, 'vs_Albastru': 0, 'vs_Gri': 0 },
 { 'culoare': 'Gri', 'vs_Portocaliu': 0, 'vs_Albastru': 0, 'vs_Verde': 0 },
 { 'culoare': 'Albastru', 'vs_Portocaliu': 0, 'vs_Verde': 0, 'vs_Gri': 0 },
]

// this function get better team from tur and retur
function getBetterTeamByDirectMatch(team1, team2) {
 const matches = document.querySelectorAll('.match');
 matches.forEach(match => {
  const matchInformations = getMatchInformations(match);
  const leftTeamName = matchInformations[0];
  const rightTeamName = matchInformations[1];
  const score = matchInformations[2];

  const scoreInt = score.split('-');
  const leftTeamGoals = parseInt(scoreInt[0]);
  const rightTeamGoals = parseInt(scoreInt[1]);

  const leftTeam = clasamentSelectiv.find(team => team.culoare === leftTeamName);
  const rightTeam = clasamentSelectiv.find(team => team.culoare === rightTeamName);

  if (leftTeam && rightTeam) {
   leftTeam[`vs_${rightTeamName}`] += leftTeamGoals - rightTeamGoals;
   rightTeam[`vs_${leftTeamName}`] += rightTeamGoals - leftTeamGoals;
  }

  if (leftTeam && rightTeam) {
   if (leftTeam[`vs_${rightTeamName}`] > rightTeam[`vs_${leftTeamName}`]) {
    return - 1;
   } else if (leftTeam[`vs_${rightTeamName}`] < rightTeam[`vs_${leftTeamName}`]) {
    return 1;
   } else {
    return 0
   }
  }
 }, this)


}

function getTeam(color) {
 for (var i = 0; i < clasament.length; i++) {
  if (clasament[i].culoare == color) {
   return clasament[i];
  }
 }
}

function buildClasament(data) {
 var table = document.getElementById('clasamentBody');

 for (var i = 0; i < data.length; i++) {
  var row = `<tr>
                            <td>${i + 1}</td>
                            <td>${data[i].culoare}</td>
                            <td>${data[i].victorii}</td>
                            <td>${data[i].egaluri}</td>
                            <td>${data[i].infrangeri}</td>
                            <td>${data[i].goluri_date}</td>
                            <td>${data[i].goluri_primite}</td>
                            <td>${data[i].golaveraj}</td>
                            <td>${data[i].punctaj}</td>
                        </tr>`
  table.innerHTML += row;
 }

}
var marcatori = []

function buildGolgheteri() {
 var table = document.getElementById('golgheteryBody');
 const players = document.querySelectorAll('li');

 players.forEach(player => {
  if (player.textContent != "") {
   marcatori.push(player.textContent);
  }
 })

 // reduce the array to unique values
 marcatoriUnici = marcatori.reduce(function (a, b) {
  if (a.indexOf(b) < 0) a.push(b);
  return a;
 }, []);

 var marcatoriFinalaArray = []

 const marcatoriFinala = document.querySelectorAll('.finala li')
 marcatoriFinala.forEach(marcator => {
  if (marcator.textContent != "") {
   marcatoriFinalaArray.push(marcator.textContent)
  }
 })

 marcatoriUnici
  .sort(function (marcator1, marcator2) {
   if (marcatori.filter(marcator => marcator == marcator1).length == marcatori.filter(marcator => marcator == marcator2).length) {
    if (marcatoriFinalaArray.filter(marcator3 => (marcator3 == marcator1)).length == marcatoriFinalaArray.filter(marcator3 => (marcator3 == marcator2)).length) {
     return 0;
    } else if (marcatoriFinalaArray.filter(marcator3 => (marcator3 == marcator1)).length > marcatoriFinalaArray.filter(marcator3 => (marcator2 == marcator2)).length) {
     return -1;
    } else {
     return 1;
    }
   } else if (marcatori.filter(marcator => marcator == marcator1).length > marcatori.filter(marcator => marcator == marcator2).length) {
    return -1;
   } else {
    return 1;
   }
  })
  .forEach((marcator, index) => {
   var row = `<tr>
                            <td>${index + 1}</td>
                            <td>${marcator}</td>
                            <td>${marcatoriFinalaArray.filter(marcator2 => (marcator2 == marcator)).length}</td>
                            <td>${marcatori.filter(marcator2 => marcator2 == marcator).length}</td></td>
                        </tr>`
   table.innerHTML += row;
  }, this)
}


// sort the clasament array by points
function sortClasament() {
 clasament.sort(function (team1, team2) {
  if (team1.punctaj == team2.punctaj) {
   //console.log(team1,team2,getBetterTeamByDirectMatch(team1,team2));

   if (getBetterTeamByDirectMatch(team1, team2) == 0) {
    if (team1.golaveraj == team2.golaveraj) {
     if (team1.goluri_date == team2.goluri_date) {
      // change table loc with the name PENALTY
      var clasament1 = document.getElementById('clasamentBody');
      var rows = clasament1.querySelectorAll('tr');
      rows.forEach(row => {
       const teamName = row.children[1].textContent.trim();
       if (teamName === team1.culoare) {
        row.children[0].textContent = 'PENALTY';
        row.children[0].style.color = 'red';
       } else if (teamName === team2.culoare) {
        row.children[0].textContent = 'PENALTY';
        row.children[0].style.color = 'red';
       }
      }, this);
      return 0;
     } else if (team1.goluri_date > team2.goluri_date) {
      return -1;
     } else {
      return 1;
     }
    } else if (team1.golaveraj > team2.golaveraj) {
     return -1;
    } else {
     return 1;
    }
   } else {
    return getBetterTeamByDirectMatch(team1, team2);
   }
  } else if (team1.punctaj > team2.punctaj) {
   return -1;
  } else {
   return 1;
  }
 });
}


sortClasament();
buildClasament(clasament);
sortClasament();

var addedDivs = [];
function addFinalsTeam(clasament) {
 var finalaMica = document.getElementById('finala-mica');
 var finalaMare = document.getElementById('finala-mare');

 const echipaStangaFinalaMica = finalaMica.children[0].children[0].children[0]

 const echipaDreaptaFinalaMica = finalaMica.children[0].children[2].children[0]

 const echipaStangaFinalaMare = finalaMare.children[0].children[0].children[0]
 const echipaDreaptaFinalaMare = finalaMare.children[0].children[2].children[0]

 const numeEchipaStangaFinalaMica = document.createElement('div')
 numeEchipaStangaFinalaMica.classList.add(clasament[2].culoare)
 numeEchipaStangaFinalaMica.textContent = clasament[2].culoare;
 echipaStangaFinalaMica.appendChild(numeEchipaStangaFinalaMica)

 const numeEchipaDreaptaFinalaMica = document.createElement('div')
 numeEchipaDreaptaFinalaMica.classList.add(clasament[3].culoare)
 numeEchipaDreaptaFinalaMica.textContent = clasament[3].culoare;
 echipaDreaptaFinalaMica.appendChild(numeEchipaDreaptaFinalaMica)

 const numeEchipaStangaFinalaMare = document.createElement('div')
 numeEchipaStangaFinalaMare.classList.add(clasament[0].culoare)
 numeEchipaStangaFinalaMare.textContent = clasament[0].culoare;
 echipaStangaFinalaMare.appendChild(numeEchipaStangaFinalaMare)

 const numeEchipaDreaptaFinalaMare = document.createElement('div')
 numeEchipaDreaptaFinalaMare.classList.add(clasament[1].culoare)
 numeEchipaDreaptaFinalaMare.textContent = clasament[1].culoare;
 echipaDreaptaFinalaMare.appendChild(numeEchipaDreaptaFinalaMare)

 // lista ul pentru echipa stânga în finala mică
 const ulEchipaStangaFinalaMica = document.createElement('ul');
 ulEchipaStangaFinalaMica.id = 'marcatori-stanga';
 ulEchipaStangaFinalaMica.classList.add('list-' + clasament[2].culoare);
 echipaStangaFinalaMica.appendChild(ulEchipaStangaFinalaMica);

 // lista ul pentru echipa dreapta în finala mică
 const ulEchipaDreaptaFinalaMica = document.createElement('ul');
 ulEchipaDreaptaFinalaMica.id = 'marcatori-dreapta';
 ulEchipaDreaptaFinalaMica.classList.add('list-' + clasament[3].culoare);
 echipaDreaptaFinalaMica.appendChild(ulEchipaDreaptaFinalaMica)

 // lista ul pentru echipa stânga în finala mare
 const ulEchipaStangaFinalaMare = document.createElement('ul');
 ulEchipaStangaFinalaMare.id = 'marcatori-stanga';
 ulEchipaStangaFinalaMare.classList.add('list-' + clasament[0].culoare);
 echipaStangaFinalaMare.appendChild(ulEchipaStangaFinalaMare);

 // lista ul pentru echipa dreapta în finala mare
 const ulEchipaDreaptaFinalaMare = document.createElement('ul');
 ulEchipaDreaptaFinalaMare.id = 'marcatori-dreapta';
 ulEchipaDreaptaFinalaMare.classList.add('list-' + clasament[1].culoare);
 echipaDreaptaFinalaMare.appendChild(ulEchipaDreaptaFinalaMare)

 // make the table centered
 const table = document.querySelector('table');
 table.style.marginLeft = 'auto';
 table.style.marginRight = 'auto';
 addedDivs.push(numeEchipaStangaFinalaMica);
 addedDivs.push(numeEchipaDreaptaFinalaMica);
 addedDivs.push(numeEchipaStangaFinalaMare);
 addedDivs.push(numeEchipaDreaptaFinalaMare);
 addedDivs.push(ulEchipaStangaFinalaMica);
 addedDivs.push(ulEchipaDreaptaFinalaMica);
 addedDivs.push(ulEchipaStangaFinalaMare);
 addedDivs.push(ulEchipaDreaptaFinalaMare);
}


addFinalsTeam(clasament);
const finale = document.querySelectorAll('.finala');
finale.forEach(finala => {
 const leftTeamGoalsUl = finala.querySelector('.left-team-info ul');
 const rightTeamGoalsUl = finala.querySelector('.right-team-info ul');

 const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
 const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

 const scoreElement = finala.querySelector('.scor');
 scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;

}, this);
//buildGolgheteri();

// listener to the forms submit event
document.getElementById('myForm').addEventListener('submit', function (event) {
 event.preventDefault();

 const form = event.target;
 const formData = new FormData(form);

 fetch(form.action, {
  method: 'POST',
  body: formData
 })
  .then(response => response.text())
  .then(data => {
   console.log(data);
  })
  .catch(error => {
   console.error('Error:', error);
  });
 return true;
});

function removeValue(cell) {
 // Remove the value from the table cell
 cell.innerHTML = '';
}

// Add event listener to delete-button
table.addEventListener('click', function (event) {
 if (event.target.classList.contains('delete-button')) {
  const cell = event.target.parentNode;
  removeValue(cell);
 }
});


//screen the table data 
export const dataPlayer = [];
const getDataButton = document.getElementById('getDataButton');
getDataButton.addEventListener('click', function () {
 const rows = table.getElementsByTagName('tr');
 const columns = table.getElementsByTagName('th');


 for (let i = 1; i < rows.length; i++) {
  const cells = rows[i].getElementsByTagName('td');
  const rowData = {};

  for (let j = 0; j < cells.length; j++) {
   const columnName = columns[j].innerText.trim();
   const cellContent = cells[j].innerText.trim();
   rowData[columnName] = cellContent;
  }

  dataPlayer.push(rowData);
 }

 console.log(dataPlayer);
 getDataButton.remove();
 removeDeleteButtons();
});


function checkTableContent() {
 const table = document.getElementById('teams');
 const rows = table.getElementsByTagName('tr');

 for (let i = 0; i < rows.length; i++) {
  const cells = rows[i].getElementsByTagName('td');
  for (let j = 0; j < cells.length; j++) {
   const cellContent = cells[j].innerText.trim();
   if (cellContent === '') {
    return false;
   }
  }
 }
 return true;
}

// getDataButton.style.display = 'none';

// setInterval(() => {
//     const shouldShowButton = checkTableContent();
//     getDataButton.style.display = shouldShowButton ? 'block' : 'none';
// }, 500);

function findFirstEmptyPosition() {
 const table = document.getElementById('teams');
 const rows = table.getElementsByTagName('tr');

 for (let j = 0; j < rows[0].cells.length; j++) {
  for (let i = 0; i < rows.length; i++) {
   const cellContent = rows[i].cells[j].innerText.trim();
   if (cellContent === '') {
    return { row: i, column: j };
   }
  }
 }

 return null;
}

function removeDeleteButtons() {
 const table = document.getElementById('teams');
 const rows = table.getElementsByTagName('tr');

 for (let i = 0; i < rows.length; i++) {
  const cells = rows[i].getElementsByTagName('td');
  for (let j = 0; j < cells.length; j++) {
   const deleteButton = cells[j].querySelector('.delete-button');
   if (deleteButton) {
    deleteButton.remove();
   }
  }
 }
}

function addValueToList(etapa) {
 var searchValue;
 switch (etapa) {
  case 1:
   searchValue = document.getElementById("searchInput1").value;
   break;
  case 2:
   searchValue = document.getElementById("searchInput2").value;
   break;
  case 3:
   searchValue = document.getElementById("searchInput3").value;
   break;
  case 4:
   searchValue = document.getElementById("searchInput4").value;
   break;
  case 5:
   searchValue = document.getElementById("searchInput5").value;
   break;
  case 6:
   searchValue = document.getElementById("searchInput6").value;
   break;
  case 7:
   searchValue = document.getElementById("searchInput7").value;
   break;
 }

 // search value in dataPlayer
 for (var i = 0; i < dataPlayer.length; i++) {
  var matchData = dataPlayer[i];
  for (var key in matchData) {
   if (matchData[key] === searchValue) {

    var listClassName = "list-" + key;
    var list = document.querySelector("#etapa" + etapa + " ul." + listClassName);
    console.log(`list: ${list}`)

    // lista are 5 elemente?

    var listItem = document.createElement("li");
    listItem.textContent = searchValue;

    // delete button
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-button');

    // delete button listener + update score
    deleteIcon.addEventListener('click', function () {
     list.removeChild(listItem);
     updateScoreMatch(etapa);
    });
    listItem.appendChild(deleteIcon);
    list.appendChild(listItem);
    updateScoreMatch(etapa);
   }
  }
 }
}

function addValueToList2(etapa) {

 var searchValue;
 var selectElement;
 switch (etapa) {
  case 1:
   searchValue = document.getElementById("searchInput8").value;
   selectElement = document.getElementById("selectare8");
   break;
  case 2:
   searchValue = document.getElementById("searchInput9").value;
   selectElement = document.getElementById("selectare9");
   break;
  case 3:
   searchValue = document.getElementById("searchInput10").value;
   selectElement = document.getElementById("selectare10");
   break;
  case 4:
   searchValue = document.getElementById("searchInput11").value;
   selectElement = document.getElementById("selectare11");
   break;
  case 5:
   searchValue = document.getElementById("searchInput12").value;
   selectElement = document.getElementById("selectare12");
   break;
  case 6:
   searchValue = document.getElementById("searchInput13").value;
   selectElement = document.getElementById("selectare13");
   break;
  case 7:
   searchValue = document.getElementById("searchInput14").value;
   selectElement = document.getElementById("selectare14");
   break;
 }

 // search value in dataPlayer
 for (var i = 0; i < dataPlayer.length; i++) {
  var matchData = dataPlayer[i];
  for (var key in matchData) {
   if (matchData[key] === searchValue) {


    var listClassName = "list-" + selectElement.value;
    //console.log(selectElement.value);
    var list = document.querySelector("#etapa" + etapa + " ul." + listClassName);

    // lista are 5 elemente?
    var listItem = document.createElement("li");
    listItem.textContent = searchValue;

    // delete button
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-button');

    // delete button listener + update score
    deleteIcon.addEventListener('click', function () {
     list.removeChild(listItem);
     updateScoreMatch(etapa);
    });
    listItem.appendChild(deleteIcon);
    list.appendChild(listItem);

    updateScoreMatch(etapa);

   }
   return;
  }
 }
}

// afisare recomandari
function afiseazaRecomandari(etapa, searchTerm) {
 var recomandari = [];
 for (var i = 0; i < dataPlayer.length; i++) {
  var matchData = dataPlayer[i];
  for (var key in matchData) {
   if (matchData[key].toLowerCase().includes(searchTerm.toLowerCase())) {
    recomandari.push(matchData[key]);
   }
  }
 }

 var recomandariList = document.getElementById("recomandari" + etapa);
 recomandariList.innerHTML = "";
 recomandari.forEach(function (recomandare) {
  var li = document.createElement("li");
  li.textContent = recomandare;
  // listener pentru cand apesi pe o obtiune dintr-o lista
  li.addEventListener("click", function () {
   document.getElementById("searchInput" + etapa).value = recomandare;
   recomandariList.innerHTML = "";
  });
  recomandariList.appendChild(li);
 });

}


function attachInputEvent(etapa) {
 var searchInput = document.getElementById("searchInput" + etapa);
 var recomandariList = document.getElementById("recomandari" + etapa);


 // adaugam recomandari pentru input
 searchInput.addEventListener("input", function () {
  var searchTerm = this.value;
  afiseazaRecomandari(etapa, searchTerm);
 });



 // ascundem lista cand dam click in afara ei
 document.addEventListener("click", function (event) {
  var isClickInsideRecomandari = recomandariList.contains(event.target);
  var isClickInsideInput = searchInput.contains(event.target);
  if (!isClickInsideRecomandari && !isClickInsideInput) {
   recomandariList.innerHTML = "";
  }
 });


}

for (var etapa = 1; etapa <= 7; etapa++) {
 attachInputEvent(etapa);
}

// functie care va fii utilizata pentru actualizarea scorului fiecarui meci
function updateScoreMatch(etapa) {
 resetClasamentValue();
 clearTable();
 const matches = document.querySelectorAll('.match');
 matches.forEach(match => {

  const leftTeamGoalsUl = match.querySelector('.left-team-info ul');
  const rightTeamGoalsUl = match.querySelector('.right-team-info ul');

  const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
  const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

  const scoreElement = match.querySelector('.scor');
  scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;

  updateClasament(match);
 }, this);

 sortClasament();
 buildClasament(clasament);
 sortClasament();
 if (etapa != 7) {
  removeFinalsTeams();
  addFinalsTeam(clasament)
  const finale = document.querySelectorAll('.finala');
  finale.forEach(finala => {
   const leftTeamGoalsUl = finala.querySelector('.left-team-info ul');
   const rightTeamGoalsUl = finala.querySelector('.right-team-info ul');

   const leftTeamGoalsCount = countNonNullLi(leftTeamGoalsUl);
   const rightTeamGoalsCount = countNonNullLi(rightTeamGoalsUl);

   const scoreElement = finala.querySelector('.scor');
   scoreElement.textContent = `${leftTeamGoalsCount} - ${rightTeamGoalsCount}`;

  }, this);
 }
 removeTableRows('golgheteryBody');
 populateGolgheteryTable();
}

function clearTable() {
 var table = document.getElementById('clasamentBody');
 table.innerHTML = '';
}

function resetClasamentValue() {
 clasament = [];
 clasamentSelectiv = [];
 clasament = [
  {
   'culoare': 'Verde', 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0,
  },
  {
   'culoare': `Portocaliu`, 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0,
  },
  {
   'culoare': `Albastru`, 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0,
  },
  {
   'culoare': `Gri`, 'meciuri_jucate': 0, 'victorii': 0, 'egaluri': 0, 'infrangeri': 0, 'goluri_date': 0, 'goluri_primite': 0, 'golaveraj': 0, 'punctaj': 0
  },
 ]

 clasamentSelectiv = [
  { 'culoare': 'Verde', 'vs_Portocaliu': 0, 'vs_Albastru': 0, 'vs_Gri': 0 },
  { 'culoare': 'Portocaliu', 'vs_Verde': 0, 'vs_Albastru': 0, 'vs_Gri': 0 },
  { 'culoare': 'Gri', 'vs_Portocaliu': 0, 'vs_Albastru': 0, 'vs_Verde': 0 },
  { 'culoare': 'Albastru', 'vs_Portocaliu': 0, 'vs_Verde': 0, 'vs_Gri': 0 },
 ]

}

function removeFinalsTeams() {
 for (var i = 0; i < addedDivs.length; i++) {
  var div = addedDivs[i];
  div.parentNode.removeChild(div);
 }
 addedDivs = [];
}

function removeTableRows(tableId) {
 var table = document.getElementById(tableId);
 if (table) {
  var rows = table.getElementsByTagName('tr');

  for (var i = rows.length - 1; i >= 0; i--) {
   table.deleteRow(i);
  }
 }
}

function addGoalScorerRows(names, finalGoals, total) {
 const tableBody = document.getElementById('golgheteryBody');


 tableBody.innerHTML = '';

 // Filter out players with a total of 0
 const filteredData = names.map((name, index) => ({
  name,
  finalGoals: finalGoals[index],
  total: total[index]
 })).filter(data => data.total > 0);

 // Sort filtered data in descending order based on the 'total' value
 const sortedData = filteredData.sort((a, b) => b.total - a.total);

 // Loop through the sorted data and add rows to the table
 sortedData.forEach((data, index) => {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${data.name}</td>
            <td>${data.finalGoals}</td>
            <td>${data.total}</td>
            `;
  tableBody.appendChild(newRow);
 });
}



function calculateTotalFinala(names) {
 const ulEchipaStangaFinalaMica = document.querySelector('#finala-mica .left-team-info ul');
 const ulEchipaDreaptaFinalaMica = document.querySelector('#finala-mica .right-team-info ul');
 const ulEchipaStangaFinalaMare = document.querySelector('#finala-mare .left-team-info ul');
 const ulEchipaDreaptaFinalaMare = document.querySelector('#finala-mare .right-team-info ul');

 const allLists = [ulEchipaStangaFinalaMica, ulEchipaDreaptaFinalaMica, ulEchipaStangaFinalaMare, ulEchipaDreaptaFinalaMare];

 const nameOccurrences = {};

 // initailize 0
 names.forEach(name => {
  nameOccurrences[name] = 0;
 });

 // Count occurrences of names in the ul lists
 allLists.forEach(ul => {
  const liElements = ul.querySelectorAll('li');
  liElements.forEach(li => {
   const playerName = li.textContent.trim();
   if (nameOccurrences.hasOwnProperty(playerName)) {
    nameOccurrences[playerName]++;
   }
  });
 });

 const occurrencesVector = names.map(name => nameOccurrences[name]);
 return occurrencesVector;
}



function calculateTotalEtapeFinala(names) {
 const allLists = document.querySelectorAll('.list-Verde, .list-Portocaliu, .list-Albastru, .list-Gri');

 const nameOccurrences = {};

 // Initialize 0
 names.forEach(name => {
  nameOccurrences[name] = 0;
 });

 // Count occurrences of names in the ul lists
 allLists.forEach(ul => {
  const liElements = ul.querySelectorAll('li');
  liElements.forEach(li => {
   const playerName = li.textContent.trim();
   if (nameOccurrences.hasOwnProperty(playerName)) {
    nameOccurrences[playerName]++;
   }
  });
 });

 const occurrencesVector = names.map(name => nameOccurrences[name]);
 return occurrencesVector;
}




function createDataPlayerName() {
 var data12 = [];
 for (var i = 0; i < dataPlayer.length; i++) {
  var matchData = dataPlayer[i];
  for (var key in matchData) {
   data12.push(matchData[key]);
  }
 }
 return data12;
}


function populateGolgheteryTable() {
 var dataPlayerName = createDataPlayerName();
 var dataPlayerFInala = calculateTotalFinala(dataPlayerName);
 var dataPlayerEtapeFinala = calculateTotalEtapeFinala(dataPlayerName);
 //console.log(dataPlayerFInala,dataPlayerEtapeFinala);
 addGoalScorerRows(dataPlayerName, dataPlayerFInala, dataPlayerEtapeFinala);
}

