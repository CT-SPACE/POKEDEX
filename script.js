let currentPokemon;
let url = "https://pokeapi.co/api/v2/pokemon/";
let statsLabels = [];
let statsData = [];

let heighestNumber = 20;
let i = 0;

async function init() {
  await loadOverview(heighestNumber, i);
}

function errorFunction() {
  console.log("Fehler aufgetreten");
}

async function loadOverview(heighestNumber, i) {
  let overview = document.getElementById("allPokemons");

  urlResponse = await fetch(url).catch(errorFunction);
  showContent = await urlResponse.json();
  console.log("Loaded URL:", showContent);

  for (i; i < heighestNumber; i++) {
    let n = i + 1;
    let currentURL = url + `${n}`;
    let response = await fetch(currentURL).catch(errorFunction);
    currentPokemon = await response.json();
    console.log("Loaded Pokemon:", currentPokemon);
    await renderPokemonHead(n, overview);
    let writeType = document.getElementById(`types${n}`);
    let type = currentPokemon.types;

    for (j = 0; j < type.length; j++) {
      writeType.innerHTML += `&bull;&nbsp;${type[j].type.name}<br>`;

      changeColorByType(type, n);
    }
    if (i == heighestNumber - 1) {
      renderLastItem(overview);
    }
  }
}

async function renderPokemonHead(n, overviewDiv) {
  let prevNumber = n - 1;
  let nextNumber = n + 1;
  overviewDiv.innerHTML += PokemonHeadHTML(n,prevNumber,nextNumber) ;
  document.getElementById(`pokemonName${n}`).innerHTML = currentPokemon["name"];
  document.getElementById(`pokemonImage${n}`).src = currentPokemon["sprites"]["other"]["official-artwork"]["front_shiny"];
  document.getElementById(`pid${n}`).innerHTML = "#" + n.toString().padStart(4, "0");
  if (n > 1 && n < 1302) {
    notFirstOrLastPokemonNumber(n,prevNumber, nextNumber); }
  else {
    if (n == 1) {
      firstPokemonNumber(n,nextNumber);
    } else if (n == 1302) {
      lastPokemonNumber(n,prevNumber);}
  }
  pokemonInfo(n);
}

function PokemonHeadHTML(n,prev,next) {

  return /*html*/ `
  <div id="pokedex${n}" class="pokedexHead" onclick="toggleBigCardBySmallCard(${n})">
    <div id="topnav${n}" class="topnav display-none">
        <div id="nav-left${n}" class="nav-btn nav-left" onclick="choosePrevPokemon(${prev})"><img src="img/left_gray.svg" id="prevPoke"><span id="prevNumber${n}"></span></div>
        <div id="nav-right${n}" class="nav-btn nav-right" onclick="chooseNextPokemon(${next})"><span id="nextNumber${n}"></span><img src="img/right_gray.svg" id="nextPoke"></div>
    </div>
    <div id="head${n}" class="smallCard">
        <h2 id="pid${n}"></h2><img id="pokemonImage${n}" class="smallImage">
        <div><h1 class="undertitle" id="pokemonName${n}">Name</h1>
        <span id="types${n}" class="type"></span></div>
     </div>
    <div id="info${n}" class="big-info-container smallinfo"></div>
    <div id="outerSkill${n}" class="outerSkills display-none">
            <div id="skills${n}" class="big-info-container overflow"></div>
    <div>
    <div id="close${n}" class="close display-none">to close - click anywhere on the card</div>
  </div>   ` ;
}

function firstPokemonNumber(n,next){
  
 document.getElementById(`nav-left${n}`).classList.add("display-none");
  document.getElementById(`nextNumber${n}`).innerHTML = "#" + next.toString().padStart(4, "0");
}

function lastPokemonNumber(n,prev){

  //document.getElementById(`nav-right${n}`).classList.add("display-none");
  document.getElementById(`prevNumber${n}`).innerHTML = "#" + prev.toString().padStart(4, "0");
}

function notFirstOrLastPokemonNumber(n,prev,next){
  if (next == (heighestNumber+1)){
    document.getElementById(`prevNumber${n}`).innerHTML = "#" + prev.toString().padStart(4, "0");
    document.getElementById(`nextNumber${n}`).innerHTML = `<div id="smallLoad" onclick="toggleNextPokemonWhileLoading(${next})">Load More</div>`;
    

  }else{
  
    document.getElementById(`nav-left${n}`).classList.remove("display-none");
    document.getElementById(`nav-right${n}`).classList.remove("display-none");
    document.getElementById(`nextNumber${n}`).innerHTML = "#" + next.toString().padStart(4, "0");
    document.getElementById(`prevNumber${n}`).innerHTML = "#" + prev.toString().padStart(4, "0");
  }
}


function renderLastItem(overviewDiv) {
  overviewDiv.innerHTML += `
    <div id="showmore" class="showmore-area"><div>
    `;
  showMoreButton();
}

function toggleOpenCloseBigCard(n) {
  let chosenCard = document.getElementById(`pokedex${n}`);
  chosenCard.classList.toggle("bigCard");
  
  let topnav = document.getElementById(`topnav${n}`);
  topnav.classList.toggle("display-none");
  let outerSkill = document.getElementById(`outerSkill${n}`);
  outerSkill.classList.toggle("display-none");
  let allPokemons = document.getElementById("allPokemons");
  allPokemons.classList.toggle("height200px");
  let pokemonImage = document.getElementById(`pokemonImage${n}`);
  pokemonImage.classList.toggle("smallImage");
  pokemonImage.classList.toggle("pokemonImage");
  let head = document.getElementById(`head${n}`);
  head.classList.toggle("height-unset");
  let close = document.getElementById(`close${n}`);
  close.classList.toggle("display-none");
}

function toggleBigCardBySmallCard(n){
  toggleOpenCloseBigCard(n) 
  chosenBigPokemon(n);
}

async function chosenBigPokemon(n) {
  let currentURL = url + `${n}`;
  let response = await fetch(currentURL).catch(errorFunction);
  currentPokemon = await response.json();
  pokemonSkills(n);
}

function pokemonInfo(n) {
  let key = "";

  let info = document.getElementById(`info${n}`);
  for (key in currentPokemon) {
    let detail = key.replace("_", " ");
    detail = detail.toUpperCase(key);
    switch (key) {
      case "height":
      case "weight":
        info.innerHTML += `<div class='category' id='${key}${n}'><h3>${detail}</h3></div>`;
        renderInfoContainer(key, n);
        break;
      default:
    }
  }
}

function pokemonSkills(n) {
  let skills = document.getElementById(`skills${n}`);
  skills.innerHTML = "";
  for (key in currentPokemon) {
    let detail = key.replace("_", " ");
    detail = detail.toUpperCase(key);
    switch (key) {
      case "abilities":
      case "stats":
      case "moves":
        skills.innerHTML += `<div class='category' id='${key}${n}'><h3>${detail}</h3></div>`;
        renderSkillsContainer(key, n);
        break;
      default:
    }
  }
}

function renderInfoContainer(key, n) {
  categoryDetail = currentPokemon[key];
  let DetailValue = Number(categoryDetail / 10);
  DetailValue = DetailValue.toFixed(1);
  DetailValue = DetailValue.replace(".", ",");
  let detail = document.getElementById(`${key}${n}`);

  let unit = "";
  switch (key) {
    case "height":
      unit = "Meter";
      break;
    case "weight":
      unit = "Kilogram";
      break;
    case "types":
      let categorytype = categoryDetail[0].type.name;
      DetailValue = categorytype;
    default:
      break;
  }
  detail.innerHTML += `
        &bull;&nbsp;${DetailValue} ${unit} </br>
        `;
}

function renderSkillsContainer(key, n) {
  let skill = "";
  if (key == `abilities`) {
    skill = "ability";
  } else if (key == `stats`) {
    skill = "stat";
  } else if (key == `moves`) {
    skill = "move";
  }
  renderSkillArrays(key, n, skill);
}

function renderSkillArrays(key, n, skill) {
  statsLabels = [];
  statsData = [];
  let detail = document.getElementById(`${key}${n}`);

  //let zeroItems = currentPokemon[key].length;
  for (let i = 0; i < currentPokemon[key].length; i++) {
    let skillNames = currentPokemon[key][i][skill].name;
    if (key == `stats`) {
      pushStatsArray(skillNames, i);
      if ( i + 1 == currentPokemon[key].length){
        renderStats(n);
      }
    } else if (key == `moves`) {
      detail.innerHTML += `
           <div class='moves'>${skillNames}</div>
            `;
    } else {
      detail.innerHTML += `
          &bull;&nbsp;${skillNames} </br> 
          `;
    }
  }

}

async function pushStatsArray(skillNames, i) {
  let statistik = currentPokemon["stats"];
  statsData.push(statistik[i].base_stat);
  statsLabels.push(skillNames);
}

async function renderStats(n) {
  let detail = document.getElementById(`stats${n}`);

  detail.innerHTML += `
    <div class="chart-container"  style="position: relative; height:30vh; width:100%">
        <canvas id="statsChart${n}" width="300px" height="200px"></canvas>
      </div>
`;
  await drawStatsChart(n);
}

function showMoreButton() {
  let showMore = document.getElementById("showmore");
  showMore.innerHTML = `
    <button class="showmore-btn" onclick="addMorePokemons()">Load More Pokemons</button>
    `;
}
async function toggleNextPokemonWhileLoading(next){
  
  await addMorePokemons();
  chooseNextPokemon(next);
}

function chooseNextPokemon(next) {

  toggleOpenCloseBigCard(`${next}`);
  chosenBigPokemon(next);
}
function choosePrevPokemon(prev) {
  toggleOpenCloseBigCard(`${prev}`);
  chosenBigPokemon(prev);
}

function changeColorByType(type, n) {
  let pokedexTile = document.getElementById(`pokedex${n}`);
  let colorType = type[0].type.name;

  switch (colorType) {
    case `${colorType}`:
      pokedexTile.style.setProperty(
        "--head-BG-first-color",
        "var(--" + `${colorType}` + "-BG-first-color)"
      );
      break;
  }
}

async function addMorePokemons() {
  try {
    const oldShowmore = document.getElementById("showmore");
    oldShowmore.remove();
  } catch { }

  heighestNumber = heighestNumber + 20;
  i = i + 20;
  await loadOverview(heighestNumber, i);
}

