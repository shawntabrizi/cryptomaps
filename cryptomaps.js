//Get the price from coinmarketcap api
async function getPrice() {
    try {
        let response = await fetch("https://api.coinmarketcap.com/v1/ticker/?limit=0");
        let data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

//Gets crypto global info
async function getGlobal() {
    try {
        let response = await fetch("https://api.coinmarketcap.com/v1/global/");
        let data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function createBlocks() {
    //I think this makes these calls happen in parellel...
    var coins = await getPrice(), global = await getGlobal();

    console.log(coins)
    console.log(global)

    var pckry = new Packery('.grid');
    var output = document.getElementById("output")


    for (c in coins) {
        var coin = coins[c];

        if (coin.market_cap_usd) {

            

            var percentSize = Math.sqrt(parseFloat(coin.market_cap_usd)) / Math.sqrt(parseFloat(global.total_market_cap_usd)) * 100;

            if (isNaN(percentSize)) {
                //console.log(coin.market_cap_usd);
            }

            console.log(percentSize)

            var block = document.createElement("div");
            block.setAttribute("class", "block");
            block.style.width = percentSize + "vw";
            block.style.height = percentSize + "vw";
            block.style.backgroundColor = getRandomColor();
            if (percentSize > 3) {
                block.innerText = coin.symbol;
            } else {
                block.title = coin.symbol;
            }

            output.appendChild(block);
            pckry.appended(block);
        }
    }
    pckry.layout();
    
}

createBlocks();

