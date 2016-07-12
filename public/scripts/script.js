'use strict';

//overview:
//user will choose certain travel preferences and a selection of planets will appear
//when user clicks on a planet, data will appear.


var travelApp = {
		num: 1,
		allPlanets: [],
		matchedPlanets:[]
};



//on submit, get value of the checked item:
travelApp.init = function(){
	 $("form").on("submit", function(e){
		e.preventDefault();
		var travelApp.userChoice = [$("input[name=climate]:checked").val()];
		//console.log(travelApp.userChoice);
		//change userchoice to include all possible climate keywords
		travelApp.choiceWords();
		travelApp.getMoreData();
	})
};

travelApp.choiceWords = function(){
	if (travelApp.userChoice.includes('warm')){
		travelApp.userChoice.push('hot', 'superheated', 'tropical');
	} 
	else if (travelApp.userChoice.includes('cold')){
		travelApp.userChoice.push('frozen', 'frigid', 'subartic', 'artic', 'subartic');
	} 
	else if (travelApp.userChoice.includes('wet')) {
		travelApp.userChoice.push('moist');
	};

	//console.log(travelApp.userChoice);
	travelApp.getPlanetData();
}

//ajax request for planet information:
travelApp.getPlanetData = function(num){
    $.ajax({
        url: 'http://swapi.co/api/planets/',
        method: 'GET',
        dataType: 'json',
        data: {
        	page: travelApp.num,
        }
    })
    .then(function(res) {
        //console.log(res.results);
        travelApp.findData(res.results)
    });
};

//for each planet, find the desired planet data (etc: climate, terrain, population)
travelApp.findData = function(planets){
	planets.forEach(function(planet){
		var planetData = {'name' : planet.name, 'climate': planet.climate, 'terrain' : planet.terrain, 'gravity' : planet.gravity, 'population': planet.population, 'residents': planet.residents, 'films': planet.films, 'url': planet.url};
		travelApp.allPlanets.push(planetData);
	});
	//call for next page
	if (travelApp.num <= 6){
	travelApp.num = travelApp.num + 1;
	travelApp.getPlanetData()
	}
	//use travelAp.planets to match the user's choice with the planets' climates
	if (travelApp.num === 6){
	travelApp.findMatches();
	} 
};

//for eaach planet, find climates that match the user's choice
travelApp.findMatches = function(){
		//if any of the items in array userChoice matches any of the value for key "climate";
		travelApp.allPlanets.forEach(function(planet){
			for (var i = 0; i < travelApp.userChoice.length; i++) {
				if (planet.climate.includes(travelApp.userChoice[i])){
					travelApp.matchedPlanets.push(planet);
				}
			};
		});
		travelApp.matchedPlanets = _.uniq(travelApp.matchedPlanets);
		//print results to page
		travelApp.displayPlanets();


};

travelApp.displayPlanets = function(){
	console.log("displayPlanets:", travelApp.matchedPlanets );
	travelApp.matchedPlanets.forEach(function(item){
		var name = $('<h3>').text(item.name);
		var climate = $('<p>').addClass('climate').text('Climate: ' + item.climate);
		var terrain = $('<p>').addClass('terrain').text('Terrain: ' + item.terrain);
		var population = $('<p>').addClass('population').text('Global Population: ' +item.population);
		var button = $('<button>').addClass('learnMore btn ' + item.name).attr("id", item.url).text('Learn More');

		// var residents = $('<p>').addClass('residents').text(item.residents);
		// var films = $('<p>').addClass('films').text(item.films);

		$('div.planet').append(name, climate, terrain, population, button);
		
	});
}

//when user clicks "learn more", retrieve more data about planet:
travelApp.getMoreData = function(){
	//event delegation: run when .learnMore exists
	$('div.planet').on('click', '.learnMore' ,function(){
		console.log(this.id);
		//run ajax call for this planet using button's id
		travelApp.getSinglePlanetData(this.id);

	})
}

travelApp.getSinglePlanetData = function(id){
	$.ajax({
	    url: id,
	    method: 'GET',
	    dataType: 'json',
	})
	.then(function(res) {
	    console.log(res);
	});
}

//document ready:
$(function(){
	console.log('runninng');
	//get Planet Data and get user's Climate choice
	travelApp.init();
});


