// get date in javascript: https://tecadmin.net/get-current-date-time-javascript/
// api: https://api.nasa.gov/
// sorting: https://gomakethings.com/sorting-an-array-by-multiple-criteria-with-vanilla-javascript/
// formatting numbers: https://blog.abelotech.com/posts/number-currency-formatting-javascript/

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function renderAPOD() {
	fetch("https://api.nasa.gov/planetary/apod?api_key=T9rcvcNgW9QZ5xvfe0repFLEiUOZBVAuQQna53lS").then(response => response.json()).then(data => {
		document.body.style.backgroundImage = "url('" + data.url + "')";
	})
}
window.addEventListener("load", renderAPOD);

function getURL() {
	const base = "https://api.nasa.gov/neo/rest/v1/feed?";
	var today = new Date();
	let startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	const apiKey = "ThEWyjBBPDnDKV2CVSqO4gRU3qjBlpkMJo06rwo8";
	return base + "start_date=" + startDate + "&api_key=" + apiKey;
}

function renderAsteroid(name, dangerous, maxDiameter, missDistance) {
	if (maxDiameter > 0.2) {
		var highlight = "text-dark bg-warning";
	} else {
		var highlight = "";
	}
  	return `<div class="col-4">
  				<div class="card m-1">
			  		<div class="card-body bg-dark text-white">
			    		<h5 class="card-title"><b>Asteroid:</b> ${name}</h5>
			    		<p class="card-text"><b>Dangerous:</b> ${dangerous}</p>
			     		<p class="card-text"><b>Maximum Diameter:</b> <span class="` + highlight + `">${parseFloat(maxDiameter).toFixed(2)} mi</span></p>
			    		<p class="card-text"><b>Miss Distance from Earth:</b> ${formatNumber(parseFloat(missDistance).toFixed(2))} mi</p>
			  		</div>
			  	</div>
			</div>`
}

function renderAsteroids(date, asteroids){
	let htmlCode = `<div><h1 class="text-center mb-3 mt-3 mr-1 ml-1 bg-dark border w-300">${date}</h1></div><div class="row text-center">`
	asteroids.sort(function(a, b) {
		if (a.is_potentially_hazardous_asteroid > b.is_potentially_hazardous_asteroid) return -1;
		if (a.is_potentially_hazardous_asteroid < b.is_potentially_hazardous_asteroid) return 1;
		if (parseFloat(a.close_approach_data[0].miss_distance.miles) < parseFloat(b.close_approach_data[0].miss_distance.miles)) return -1;
		if (parseFloat(a.close_approach_data[0].miss_distance.miles) > parseFloat(b.close_approach_data[0].miss_distance.miles)) return 1;
	})
	asteroids.forEach(asteroid => {
	 	htmlCode += renderAsteroid(asteroid.name, asteroid.is_potentially_hazardous_asteroid, asteroid.estimated_diameter.miles.estimated_diameter_max, asteroid.close_approach_data[0].miss_distance.miles);
	})
	return htmlCode += `</div><hr>`;
}

function listAsteroids() {
	let url = getURL();
	fetch(url).then((response) => response.json()).then(data => {
		let htmlCodeFinal = "";
		(Object.keys(data.near_earth_objects)).sort().forEach(date => {
  			htmlCodeFinal += renderAsteroids(date, data.near_earth_objects[date]);
		});
    	let element = document.querySelector("#asteroids");
    	element.innerHTML = htmlCodeFinal;
    });
}
window.addEventListener("load", listAsteroids);
//https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=hEWyjBBPDnDKV2CVSqO4gRU3qjBlpk

