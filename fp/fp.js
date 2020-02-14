// function to calculate portfolio value
function calculatePortfolioValue() {
	let portfolioValue = document.querySelector("#portfolio-value");
	let netProfit = document.querySelector("#net-profit");
	let stocks = document.querySelectorAll("#stocks tbody tr");
	let totVal = 0;
	let netProf = 0;
	for (stock of stocks) {
		totVal += parseFloat(stock.querySelector(":nth-child(4)").innerHTML);
		netProf += parseFloat(stock.querySelector(":nth-child(6)").innerHTML);
	}
	portfolioValue.innerHTML = parseFloat(totVal).toFixed(2);
	netProfit.innerHTML = "$" + parseFloat(netProf).toFixed(2);
	if (netProf < 0) {
		netProfit.style.color = "red";
	} else {
		netProfit.style.color = "green";
	}
}

// function for adding stock to a portfolio or loading stocks
function renderPortfolio(symbolValue, sharesValue, initialValue) {
	var request = new XMLHttpRequest();
	// query API
	request.open("GET", "https://cloud.iexapis.com/stable/stock/market/batch?symbols=" + symbolValue + "&types=quote&token=sk_0b2fe21aa32342e7b0a1806dff4beaf6", false)
	request.send(null)
	if (request.status === 200) {
  		data = JSON.parse(request.responseText);
	}
	// determine if profit should be negative or positive
	if (((data[symbolValue].quote.latestPrice*sharesValue) - initialValue) < 0) {
		color = "red";
	} else {
		color = "green";
	}
	// return html of new row
	return `<tr id=${symbolValue}>
				<td>${symbolValue}</td>
				<td>${sharesValue}</td>
				<td>${parseFloat(data[symbolValue].quote.latestPrice).toFixed(2)}</td>
				<td>${parseFloat(data[symbolValue].quote.latestPrice*sharesValue).toFixed(2)}</td>
				<td>${parseFloat(initialValue).toFixed(2)}</td>
				<td style="color:${color};">${parseFloat((data[symbolValue].quote.latestPrice*sharesValue) - initialValue).toFixed(2)}</td>
				<td>
					<form id="sell"${symbolValue}>
						<div class="form-group row m-0">
							<div class="col-7">
								<input type="number" class="form-control" placeholder="Shares" max=${sharesValue} min=1>
							</div>
							<div class="col-5">
								<button type="submit" class="btn btn-outline-success">Sell</button>
							</div>
						</div>
					</form>
				</td>
			</tr>`;
}

// load user's stock portfolio when page loads
function loadStockPortfolio() {
	// render stock portfolio on page
	let htmlForPortfolio = "";
	for (var i = 0; i < localStorage.length; i++) {
	    var key = localStorage.key(i);
	    var value = JSON.parse(localStorage.getItem(key));
	    htmlForPortfolio += renderPortfolio(key, value[0], value[1]) 
	}	
	let stocks = document.querySelector("#stocks tbody");
	stocks.innerHTML = htmlForPortfolio;
	// calculate total portfolio value
	calculatePortfolioValue();
}
window.addEventListener("load", function() {
	loadStockPortfolio();
	// call function to add event listener to rows of stock portfolio
	sellForms();
})

// when user types in stock symbol, fill in price
async function logPrice(e) {
	e.preventDefault();
	console.log(e);
  	const symbolValue = document.querySelector("#symbol").value;
	let http_response = await fetch("https://cloud.iexapis.com/stable/stock/market/batch?symbols=" + symbolValue + "&types=quote&token=sk_0b2fe21aa32342e7b0a1806dff4beaf6");
	let data = await http_response.json();
	let pps = document.querySelector("#pps");
	pps.value = data[symbolValue].quote.latestPrice
}
document.querySelector("#symbol").addEventListener("input", logPrice);

// when user enters the shares they want, fill in the total cost
function logTotal(e) {
	e.preventDefault();
	console.log(e);
  	const sharesValue = document.querySelector("#shares").value;
  	const totalCost = document.querySelector("#total");
  	const pps = document.querySelector("#pps");
  	totalCost.value = pps.value*sharesValue
}
document.querySelector("#shares").addEventListener("input", logTotal);

// purchase stock and add it to the stock portfolio
function buyStock(e) {
	e.preventDefault();
	console.log(e);
	const symbolValue = document.querySelector("#symbol").value;
	const sharesValue = document.querySelector("#shares").value;
	const initialValue = document.querySelector("#total").value;
	let stocks = document.querySelector("#stocks tbody");

	// to determine if stock is already in the portfolio
	let alreadyInPortfolio = 0;
	const rows = document.querySelectorAll("#stocks tbody tr");
	for (row of rows) {
		if (symbolValue === row.id) {
			alreadyInPortfolio = 1
		}
	}
	
	// if some of stock is not already purchased, then add everything
	if (alreadyInPortfolio === 0) {
		renderPortfolio(symbolValue, sharesValue, initialValue);

		// update data that needs to be preserved - symbol, shares, and initial value - to local storage
		var portfolioData = [sharesValue, initialValue];
		localStorage.setItem(symbolValue, JSON.stringify(portfolioData));

	} else { // If some of stock is already purchased, then update shares, total, initial, and profit/loss
		// update shares
		const stock = document.querySelector("[id=" + CSS.escape(symbolValue) + "]");
		const oldShares = stock.querySelector(":nth-child(2)").innerHTML;
		stock.querySelector(":nth-child(2)").innerHTML = parseInt(parseFloat(oldShares) + parseFloat(sharesValue));
		newShares = parseInt(stock.querySelector(":nth-child(2)").innerHTML)

		// update total
		const pps = stock.querySelector(":nth-child(3)").innerHTML;
		stock.querySelector(":nth-child(4)").innerHTML = parseFloat(newShares*parseFloat(pps)).toFixed(2);
		newTotal = stock.querySelector(":nth-child(4)").innerHTML

		// update initial
		const oldInitial = stock.querySelector(":nth-child(5)").innerHTML;
		stock.querySelector(":nth-child(5)").innerHTML = parseFloat(parseFloat(oldInitial) + parseFloat(initialValue)).toFixed(2);
		const newInitial = stock.querySelector(":nth-child(5)").innerHTML;

		// update P&L
		stock.querySelector(":nth-child(6)").innerHTML = parseFloat(parseFloat(newTotal) - parseFloat(newInitial)).toFixed(2);
		if (parseFloat(newTotal) - parseFloat(newInitial) < 0) {
			stock.querySelector(":nth-child(6)").style.color = "red"
		} else {
			stock.querySelector(":nth-child(6)").style.color = "green"
		}

		// update amount you can sell
		let sell = stock.querySelector(":nth-child(7) form div div input");
		sell.max = newShares;

		// update data that needs to be preserved - symbol, shares, and initial value - to local storage
		var portfolioData = [newShares, newInitial];
		localStorage.setItem(symbolValue, JSON.stringify(portfolioData));
	}
	location.reload();
	return false;
}
document.querySelector("#purchase-stock").addEventListener("submit", buyStock);

// sell stock and remove from portfolio
async function sellStock(e) {
	e.preventDefault();

	const sharesValue = document.querySelector("#" + this.id + " input").value;
	const rowToUpdate = this.parentElement.parentElement;
	console.log(rowToUpdate)
	const symbolValue = rowToUpdate.querySelector(":first-child").innerHTML;
	const oldShares = parseInt(rowToUpdate.querySelector(":nth-child(2)").innerHTML);
	const oldInitial = parseFloat(rowToUpdate.querySelector(":nth-child(5)").innerHTML);
	let http_response = await fetch("https://cloud.iexapis.com/stable/stock/market/batch?symbols=" + symbolValue + "&types=quote&token=sk_0b2fe21aa32342e7b0a1806dff4beaf6");
	let data = await http_response.json();
	const soldAmt = data[symbolValue].quote.latestPrice*sharesValue;

	if (oldShares-sharesValue === 0) {
		localStorage.removeItem(symbolValue);	
	} else {
		var portfolioData = [oldShares-sharesValue, oldInitial - (oldInitial/oldShares)*sharesValue];
		localStorage.setItem(symbolValue, JSON.stringify(portfolioData));
	}
	location.reload();
	return false;
}
function sellForms() {
	rows = document.querySelectorAll("td form");
	for (row of rows) {
		row.addEventListener("submit", sellStock)
	}
}

// sort table
$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc) {
    	rows = rows.reverse()
    }
    for (var i = 0; i < rows.length; i++) {
    	table.append(rows[i])
    }
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index) { 
	return $(row).children('td').eq(index).text() 
}
