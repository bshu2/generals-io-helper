var previous, loop, mapLoop;
var colors = ['red','blue','green','purple','orange','darkgreen','brown','maroon','teal'];
var mountains = [];
var cities = [];
var generals = [];
var allies = [];
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
  
  previous = new Map();

  var cols = rows[0].children.length;
  rows[0].appendChild(document.createElement('td'));
  rows[0].children[cols].textContent = "ΔArmy";
  for (let i = 1; i < rows.length; i++) {
    rows[i].appendChild(document.createElement('td'));
    var color = rows[i].children[cols - 3].className.split(' ')[1];
    previous.set(color, {land: 1, army: 1});
    rows[i].children[cols].textContent = "1";
  }

  mountains = [];
  cities = [];
  generals = [];
  var alliedGenerals = document.getElementsByClassName("general");
  for (let ally of alliedGenerals) {
    allies.push(ally);
  }
}

function getArmyDiff() {
  var rows = document.getElementById("game-leaderboard").children[0].children;
  var cols = rows[0].children.length;
  for (let i = 1; i < rows.length; i++) {
    var color = rows[i].children[cols - 4].className.split(' ')[1];
    var army = +rows[i].children[cols - 3].textContent;
    var land = +rows[i].children[cols - 2].textContent;
    var armyDiff = army - previous.get(color).army;
    rows[i].children[cols - 1].textContent = armyDiff.toString();

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
        if (checkGeneral(color)) {
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

function checkGeneral(color) {
  var deadGenerals = document.getElementsByClassName("dead");
  for (let dead of deadGenerals) {
    if (dead.children[1].classList.contains(color)) {
      return false;
    }
  }
  for (let ally of allies) {
    if (ally.classList.contains(color)) {
      return false;
    }
  }
  return true;
}