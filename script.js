var previous, loop, mapLoop;
var colors = ['red','blue','green','purple','orange','darkgreen','brown','maroon','teal'];
var mountains = [];
var cities = [];
var generals = [];
//window.onload = set_mutation_observer;

set_mutation_observer();

function set_mutation_observer() {
  console.log("set_mutation_observer");
  var target = document.getElementById("react-container");

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(added) {
        if (added.id === "game-page") {
          setTimeout(init, 100);

          loop = setInterval(getArmyDiff, 1000);
          mapLoop = setInterval(updateMap, 200);
        }
      });
      mutation.removedNodes.forEach(function(removed) {
        if (removed.id === "game-page") {
          clearInterval(loop);
          clearInterval(mapLoop);
        }
      });
    });
  });
  var config = { childList: true, subtree: true};
  observer.observe(target, config);
}

function init() {
  //console.log("init");
  var rows = document.getElementById("game-leaderboard").children[0].children;
  console.log(rows);
  previous = new Map();

  for (let row of rows) {
    var name = row.children[1].textContent;
    row.appendChild(document.createElement('td'));
    if (name === "Player") {
      row.children[4].textContent = "ΔArmy";
    }
    else {
      var color = row.children[1].className.split(' ')[1];
      previous.set(color,{land: 1, army: 1});
      row.children[4].textContent = "1";
    }
  }
  mountains = [];
  cities = [];
  generals = [];}

function getArmyDiff() {
  //console.log("loop");
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for (let row of rows) {
    var name = row.children[1].textContent;
    if (name === "Player") {
      continue;
    }
    var color = row.children[1].className.split(' ')[1];
    var army = +row.children[2].textContent;
    var land = +row.children[3].textContent;
    var armyDiff = army - previous.get(color).army;
    row.children[4].textContent = armyDiff.toString();

    previous.set(color, {army: army, land: land});
  }
}

function updateMap() {
  var map = document.getElementById("map").children[0];
  for (let mountain of mountains) {
    let cell = map.children[mountain.row].children[mountain.col];
    if (!cell.classList.contains("mountain") && cell.classList.contains("obstacle")) {
      cell.classList.add("mountain");
      cell.classList.remove("obstacle");
    }
  }
  for (let city of cities) {
    let cell = map.children[city.row].children[city.col];
    if (!cell.classList.contains("city") && cell.classList.contains("obstacle")) {
      cell.classList.add("city");
      cell.classList.remove("obstacle");
    }
  }
  for (let general of generals) {
    let cell = map.children[general.row].children[general.col];
    if (!cell.classList.contains("city") && !cell.classList.contains("general")) {
      cell.classList.add("general", general.color);
    }
  }
  updateKnownObstacles();
}


function updateKnownObstacles() {
  var map = document.getElementById("map").children[0];
  var height = map.children.length;
  var width = map.children[0].children.length;
  mountains = [];
  cities = [];
  generals = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      let cell = map.children[row].children[col];
      if (cell.classList.contains("mountain")) {
        mountains.push({row:row, col:col});
      }
      if (cell.classList.contains("city")) {
        cities.push({row:row, col:col});
      }
      if (cell.classList.contains("general")) {
        let color = getColor(cell);
        if (!isDeadGeneral(color)) {
          generals.push({row:row, col:col, color:color});
        }
      }
    }
  }
}

function getColor(cell) {
  for (let color of colors) {
    if (cell.classList.contains(color)) {
      return color;
    }
  }
  return "none";
}

function isDeadGeneral(color) {
  var deadGenerals = document.getElementsByClassName("dead");
  for (let dead of deadGenerals) {
    if (dead.children[1].classList.contains(color)) {
      return true;
    }
  }
  return false;
}