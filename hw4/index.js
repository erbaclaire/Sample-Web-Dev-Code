// get date in javascript: https://tecadmin.net/get-current-date-time-javascript/
// api: https://api.nasa.gov/
// sorting: https://gomakethings.com/sorting-an-array-by-multiple-criteria-with-vanilla-javascript/
// formatting numbers: https://blog.abelotech.com/posts/number-currency-formatting-javascript/

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

// render APOD background
function renderAPOD() {
	fetch("https://api.nasa.gov/planetary/apod?api_key=T9rcvcNgW9QZ5xvfe0repFLEiUOZBVAuQQna53lS").then(response => response.json()).then(data => {
		document.body.style.backgroundImage = "url('" + data.url + "')";
	})
}
window.addEventListener("load", renderAPOD);

// render asteroids near Earth on a given date
function getURL() {
	const base = "https://api.nasa.gov/neo/rest/v1/feed?";
	var today = new Date();
	let startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	const apiKey = "T9rcvcNgW9QZ5xvfe0repFLEiUOZBVAuQQna53lS";
	return base + "start_date=" + startDate + "&api_key=" + apiKey;
}

function renderAsteroid(name, time, dangerous, maxDiameter, missDistance) {
	if (dangerous === true) {
		var highlight = "text-dark bg-warning";
	} else {
		var highlight = "";
	}
	if (maxDiameter > 0.2) {
		var highlight2 = "text-dark bg-warning";
	} else {
		var highlight2 = "";
	}
  	return `<div class="col-4">
  				<div class="card m-1">
			  		<div class="card-body bg-dark text-white">
			    		<h5 class="card-title"><span class="` + highlight + `"><b>Asteroid:</b> ${name}</span></h5>
			    		<p class="card-text"><b>Time Asteroid Passes Earth:</b> ${time}</p>
			    		<p class="card-text"><b>Potentially Hazerdous:</b> ${dangerous}</p>
			     		<p class="card-text"><b>Maximum Diameter:</b> <span class="` + highlight2 + `">${parseFloat(maxDiameter).toFixed(2)} mi</span></p>
			    		<p class="card-text"><b>Miss Distance from Earth:</b> ${formatNumber(parseFloat(missDistance).toFixed(2))} mi</p>
			  		</div>
			  	</div>
			</div>`
}

function renderAsteroids(date, asteroids){
	let htmlCode = `<div id=${date} class="mt-5"><h3 class="text-left ml-1 outlined">${date}</h3></div><div class="row text-center">`
	asteroids.sort(function(a, b) {
		if (a.is_potentially_hazardous_asteroid > b.is_potentially_hazardous_asteroid) return -1;
		if (a.is_potentially_hazardous_asteroid < b.is_potentially_hazardous_asteroid) return 1;
		if (parseFloat(a.close_approach_data[0].miss_distance.miles) < parseFloat(b.close_approach_data[0].miss_distance.miles)) return -1;
		if (parseFloat(a.close_approach_data[0].miss_distance.miles) > parseFloat(b.close_approach_data[0].miss_distance.miles)) return 1;
	})
	asteroids.forEach(asteroid => {
		if (asteroid.is_potentially_hazardous_asteroid === true) { weeklyHazerdous.push(asteroid) }
	 	htmlCode += renderAsteroid(asteroid.name, asteroid.close_approach_data[0].close_approach_date_full, asteroid.is_potentially_hazardous_asteroid, asteroid.estimated_diameter.miles.estimated_diameter_max, asteroid.close_approach_data[0].miss_distance.miles);
	})
	return htmlCode += `</div>`;
}

function listAsteroids() {
	let url = getURL();
	fetch(url).then((response) => response.json()).then(data => {
		let htmlCodeFinal = "";
		let navigatorsCode = "";
		(Object.keys(data.near_earth_objects)).sort().forEach(date => {
  			htmlCodeFinal += renderAsteroids(date, data.near_earth_objects[date]);
  			navigatorsCode += `<a href=#${date} id="test" class="btn btn-primary mt-3 mb-5 ml-5" role="button">${date}</a>`
		});
    	let element = document.querySelector("#asteroids");
    	element.innerHTML = htmlCodeFinal;
    	let navigators = document.querySelector("#navigators");
    	navigators.innerHTML += navigatorsCode;
    });
}
window.addEventListener("load", listAsteroids);

// display and sort most hazerdous
var weeklyHazerdous = [];
function sortByDate(array) {
	return array.sort((a, b) => {
			if (a.close_approach_data[0].close_approach_date_full > b.close_approach_data[0].close_approach_date_full) return 1;
			if (a.close_approach_data[0].close_approach_date_full < b.close_approach_data[0].close_approach_date_full) return -1;
		})
}
function sortByDiameter(array) {
	return array.sort((a, b) => {
			if (parseFloat(a.estimated_diameter.miles.estimated_diameter_max) > parseFloat(b.estimated_diameter.miles.estimated_diameter_max)) return -1;
			if (parseFloat(a.estimated_diameter.miles.estimated_diameter_max) < parseFloat(b.estimated_diameter.miles.estimated_diameter_max)) return 1;
		})
}
function sortByDistance(array) {
	return array.sort((a, b) => {
			if (parseFloat(a.close_approach_data[0].miss_distance.miles) < parseFloat(b.close_approach_data[0].miss_distance.miles)) return -1;
			if (parseFloat(a.close_approach_data[0].miss_distance.miles) > parseFloat(b.close_approach_data[0].miss_distance.miles)) return 1;
		})
}
function renderMostHazerdous(property) {
	return function() {
		weeklyHazerdousHTML = "<div class='mt-5 row'>";
		if (property === "date") { var newArray = sortByDate(weeklyHazerdous); }
		if (property === "diameter") { var newArray = sortByDiameter(weeklyHazerdous); }
		if (property === "distance") { var newArray = sortByDistance(weeklyHazerdous); }
		newArray.forEach(asteroid => {
		weeklyHazerdousHTML += `<div class="col-2">
	  								<div class="card m-1">
				  						<div class="card-body bg-light text-dark" style="height: 20rem;">
				    						<h5 class="card-title"><b>Asteroid: </b> ${asteroid.name}</h5>
				    						<p class="card-title"><b>Close Pass Date: </b> ${asteroid.close_approach_data[0].close_approach_date_full}</p>
				     						<p class="card-text"><b>Maximum Diameter: </b>${parseFloat(asteroid.estimated_diameter.miles.estimated_diameter_max).toFixed(2)} mi</p>
				    						<p class="card-text"><b>Miss Distance from Earth: </b> ${formatNumber(parseFloat(asteroid.close_approach_data[0].miss_distance.miles).toFixed(2))} mi</p>
				  						</div>
				  					</div>
								</div>`
			})
	element = document.querySelector("#WMHCards");
	element.innerHTML = weeklyHazerdousHTML + "</div";
}
}
document.querySelector("#mostHazerdousByDate").addEventListener("click", renderMostHazerdous("date"));
document.querySelector("#mostHazerdousByDiameter").addEventListener("click", renderMostHazerdous("diameter"));
document.querySelector("#mostHazerdousByDistance").addEventListener("click", renderMostHazerdous("distance"));

