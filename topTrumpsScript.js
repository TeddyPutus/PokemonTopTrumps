//top trumps game stuff
let playerDeck = [], computerDeck = [];
const infoBox = document.getElementById("info-box");
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");


async function fetchRandomPokemon(){
    try{
        let pokemonID = Math.floor(Math.random() * 151) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
        const data = await response.json();
        return data;
    }catch(error){
        console.log("why")
    }    
}

async function fillDecks(){
    try{
        for(let i = 0; i < 10; i++){
            await fetchRandomPokemon().then(data => {playerDeck.push(data)})
            await fetchRandomPokemon().then(data => {computerDeck.push(data)})
        }  
    } catch(error){
        console.log("fail")
    }
      
}

function setUpGame(){
    fillDecks().then(function(){
        renderCard(playerDeck[0], true);
        renderBlankCard();
    })
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function renderCard(data, player){
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("pokemon-card");
    mainDiv.style.backgroundColor = getBackgroundColourFromType(data.types[0].type.name);

    const nameHPDiv = document.createElement("div");
    nameHPDiv.classList.add("name-hp-div");

    const name = document.createElement("h2");
    name.innerText = capitalizeFirstLetter(data.name);
    // const hpText = document.createElement("h2");
    // hpText.innerText = `${data.stats[0].stat.name}: ${data.stats[0].base_stat}`;

    nameHPDiv.append(name);

    const image = document.createElement("img");
    image.src = data.sprites.front_default;
    image.alt = `Picture of data.name`;

    const moveDiv = document.createElement("div");
    moveDiv.classList.add("move-div");

    for(let stat of data.stats){
        let newMove = document.createElement("button");
        newMove.classList.add("stat-button");
        newMove.innerText = `${stat.stat.name} ${stat.base_stat}`;
        moveDiv.append(newMove);
        
        if(player){
            newMove.addEventListener("click", () => {
                playTurn(stat);
            });
        }
    }

    mainDiv.append(nameHPDiv, image, moveDiv);

    infoBox.append(mainDiv);
}

function renderBlankCard(data){
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("pokemon-card");
    mainDiv.setAttribute("id", "blank-card");
    mainDiv.style.backgroundColor = "gray";

    infoBox.append(mainDiv);
}


function getBackgroundColourFromType(type){
    switch(type){
        case "bug":
            return "darkgreen";
        case "dark":
            return "darkgray";
        case "dragon":
            return "turqoise";
        case "electric":
            return "gold";
        case "fairy":
            return "darkpink";
        case "fighting":
            return "orange";
        case "fire":
            return "red";
        case "flying":
            return "gray";
        case "ghost":
            return "purple";
        case "grass":
            return "green";
        case "ground":
            return "burlywood";
        case "ice":
            return "skyblue";
        case "normal":
            return "pink";
        case "poison":
            return "indigo";
        case "psychic":
            return "palevioletred";
        case "ground":
        case "rock":
            return "brown";
        case "steel":
            return "teal";
        case "water":
            return "blue";
        default:
            return "white";
    }
}

function findMatchingStat(stat, playerToSearch)
{
    let cardToSearch = playerToSearch === "cpu" ? computerDeck[0] : playerDeck[0]
    for(let statToCompare of cardToSearch.stats){
        if(stat.stat.name === statToCompare.stat.name){
            console.log(stat.base_stat)
            console.log(statToCompare.base_stat)
            return stat.base_stat > statToCompare.base_stat ? playerToSearch === "cpu" ? "player": "cpu" : playerToSearch === "cpu" ? "cpu": "player"
        }
    }
    return "draw";
}

function playTurn(stat){
    infoBox.removeChild(document.getElementById("blank-card"));
    renderCard(computerDeck[0]);

    let winner = findMatchingStat(stat, "cpu");
    console.log("winner is "+winner)
    winner === "player" ? winRound("player") : winner === "cpu" ? winRound("cpu") : drawRound()

    if(playerDeck.length === 0 || computerDeck.length === 0) gameOver(winner);
    else{
        setTimeout(() => {
            infoBox.removeChild(document.querySelector(".pokemon-card"));
            infoBox.removeChild(document.querySelector(".pokemon-card"));
            renderCard(playerDeck[0], true);
            renderBlankCard();
        }, 1000);
        
    }
}

function drawRound(){
    let playerCard = playerDeck.shift();
    playerDeck.push(playerCard);

    let cpuCard = computerDeck.shift();
    computerDeck.push(cpuCard);
}

function winRound(player){
    let card;
    if(player === "player"){
        card = computerDeck.shift();
        playerDeck.push(card);

        let playerCard = playerDeck.shift();
        playerDeck.push(playerCard);
    }else{
        card = playerDeck.shift();
        computerDeck.push(card);

        let cpuCard = computerDeck.shift();
        computerDeck.push(cpuCard);
    }
    console.log(card)
    playerScore.innerText = `Player Cards Left: ${playerDeck.length}`;
    computerScore.innerText = `CPU Cards Left: ${computerDeck.length}`;
}

function gameOver(winner){
    infoBox.removeChild(document.querySelector(".pokemon-card"));
    infoBox.removeChild(document.querySelector(".pokemon-card"));

    const gameOver = document.createElement("h2");
    gameOver.innerText = `${winner} WINS!!! Play Again?`

    const resetButton = document.createElement("button");
    resetButton.addEventListener("click", () => {
        infoBox.removeChild(document.querySelector("h2"));
        infoBox.removeChild(document.querySelector("button"));
        setUpGame()
    });
}

setUpGame()