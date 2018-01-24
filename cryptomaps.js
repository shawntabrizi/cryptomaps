//Store api data here, so resizing doesn't make another call
var globalCoins;

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

//main function
async function createBlocks() {
    try {
        var slider = document.getElementById("slider")

        //if tokens aren't loaded yet...
        if (!globalCoins) {
            globalCoins = await getPrice();
            //set the slider max to the max number of tokens
            slider.max = globalCoins.length
        }

        //Get value of slider
        var range = slider.value;

        //subarray of coin data up to the slider limit
        var coins = globalCoins.slice(0, range);

        //keep track of market total of the subset of coins
        var total = 0;

        //calculate total market cap of subset of coins
        for (c in coins) {
            var coin = coins[c]
            if (coin.market_cap_usd) {
                total += parseFloat(coin.market_cap_usd)
            }
        }

        //update page to show the marketcap
        document.getElementById("marketcap").innerText = "Represented market cap: $" + parseFloat(total).toLocaleString();

        //new packery object
        var pckry = new Packery('.grid', {
            //disable resize because we handle it ourselves
            resize: false
        });

        //make sure page is empty
        var output = document.getElementById("output")
        output.innerHTML = ""

        //calculate viewport area, minus the header and footer
        var viewportwidth = window.innerWidth;
        var viewportheight = window.innerHeight;
        var viewportarea = (viewportheight - 80) * viewportwidth;

        //for each coin
        for (c in coins) {
            var coin = coins[c];
            //if it has market cap data
            if (coin.market_cap_usd) {

                //calculate percentage of the total market cap, multiplied by the area giving percentage of the area it needs to fill.
                //Square root to find the length of one side of the square
                // * .97 to account for borders... no science here
                var blockSideLength = Math.sqrt(parseFloat(coin.market_cap_usd) / parseFloat(total) * viewportarea) * .97;

                //create block for coin
                var block = document.createElement("div");
                block.setAttribute("class", "coinBlock");

                //set height and width equal to calculated size
                block.style.width = blockSideLength + "px";
                block.style.height = blockSideLength + "px";

                //set background image of block to be the coin icon
                block.style.backgroundImage = "url('https://files.coinmarketcap.com/static/img/coins/128x128/" + coin.id + ".png')"

                //add hover over information
                block.title = `${coin.symbol}: $${parseFloat(coin.market_cap_usd).toLocaleString()} [$${parseFloat(coin.price_usd).toLocaleString()}] (${(coin.percent_change_24h > 0 ? '+' + coin.percent_change_24h : coin.percent_change_24h)}%)`;

                //Make border green if change is positive, red if change is negative, and black if change fails to meet those conditions
                if (parseFloat(coin.percent_change_24h) > 0) {
                    block.style.borderColor = "green"
                } else if (parseFloat(coin.percent_change_24h) < 0) {
                    block.style.borderColor = "red"
                } else {
                    block.style.borderColor = "black"
                }

                //add block to output and add to packery
                output.appendChild(block);
                pckry.appended(block);
            }
        }

        //let packery arrange the items
        pckry.layout();

        //remove loading/updating message
        document.getElementById("message").style.display = "none";
    } catch (error) {
        document.getElementById("message").innerText = error;
    }
    
}

//when page loads
window.onload = function () {
    //get slider stuff
    var slider = document.getElementById("slider");
    var sliderOutput = document.getElementById("sliderValue");

    //set slider output
    sliderOutput.innerText = slider.value + " coins";

    //when slider moves, dynamically update the value of the slider output
    slider.oninput = function () {
        sliderOutput.innerText = this.value + " coins";
    }

    //add slider listener to update page once slider value has been selected
    slider.addEventListener("change", updatePage);

    //create the blocks for the first time
    createBlocks();
}

//if page gets resized, update the page
window.onresize = function () {
    updatePage();
}

//track timeout
var doit;

//if page is trying to be updated...
function updatePage() {
    //clear the timeout
    clearTimeout(doit);
    //add message
    var message = document.getElementById("message")
    message.style.display = "unset";
    message.innerText = "Updating..."

    // run the function only if the timeout it met
    //good for resizing the window, and not causing the function to run until resize is complete
    doit = setTimeout(createBlocks, 200);
}

