var travelApp = {

};

$(function(){
	console.log('runninng');
	travelApp.num = 1;
	travelApp.getPlanetData();
	travelApp.planetData = {};
	travelApp.planets = [];
});


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
		var planetData = {'name' : planet.name, 'climate': planet.climate, 'terrain' : planet.terrain};
		travelApp.planets.push(planetData);
		//console.log('name: ', planet.name, '; climate: ', planet.climate, '; terrain: ', planet.terrain);
	});
	//call for next page
	if (travelApp.num <= 6){
	travelApp.num = travelApp.num + 1;
	travelApp.getPlanetData()
	}
}