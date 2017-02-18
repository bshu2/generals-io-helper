var previous, loop;

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
          loop = setInterval(getDiff, 100);
        }
      });
      mutation.removedNodes.forEach(function(removed) {
        if (removed.id === "game-page") {
          clearInterval(loop);
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
}

function getDiff() {
  //console.log("loop");
  var rows = document.getElementById("game-leaderboard").children[0].children;
  for(let row of rows){
    var name = row.children[1].textContent;
    if(name === "Player"){
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