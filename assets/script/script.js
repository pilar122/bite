// Results START
$(document).ready(function(){
	$("#results-page").hide();

	let favorites = [];	
	$("#add-btn").on('click', function (event) {
		event.preventDefault();
		$("#results-page").show(); 
		
		if($('#user-input').val() === ''){
			return false;
		} else {
			localStorage.clear();
      		localStorage.setItem("input-address", $('#user-input').val());

			$('html,body').animate({
				scrollTop: $("#results-page").offset().top},
				'slow');
			
			$('#page-input').val(localStorage.getItem("input-address"));

			drawInitMap(); 
			getYelpSearchResults();
		}
	});

// Results END


// INPUT START
$("#user-input").keypress(function(event) {
    if(event.which == 13) {
        event.preventDefault();
        $("#results-page").show(); 
    
        if($('#user-input').val() === ''){
            return false;
        } else {
            localStorage.clear();
              localStorage.setItem("input-address", $('#user-input').val());

        $('html,body').animate({
            scrollTop: $("#results-page").offset().top},
            'slow');
        
        $('#page-input').val(localStorage.getItem("input-address"));

        drawInitMap(); 
        getYelpSearchResults();
    }
    }
});

// INPUT END


// BUTTONS START
$("#page-btn").on('click', function(event){
    event.preventDefault();

    if($('#page-input').val() === ''){
        return false;
    } else {
        localStorage.clear();
          localStorage.setItem("input-address", $('#page-input').val());

        drawInitMap(); 
        getYelpSearchResults();
    }

});

$("#page-input").keypress(function(event) {
    if(event.which == 13) {
        event.preventDefault();

        if($('#page-input').val() === ''){
            return false;
        } else {
            localStorage.clear();
              localStorage.setItem("input-address", $('#page-input').val());

            drawInitMap(); 
            getYelpSearchResults();
        }

    };
});

// BUTTONS END

// RESULTS AGAIN
$("#content-results").on('click', '.direction', function(){
    let latitude = $(this).attr('data-lat');
    let longitude = $(this).attr('data-long');

    // let directionsId = $(this).siblings('div').attr('id');
    let directionsId = $(this).parent().parent().parent().siblings('div').attr('id');

    let origin = localStorage.getItem("input-address");
            
    getAddressTxt(latitude, longitude, function(destination){
        getDirections(origin, destination, directionsId);
    });

});

$("#content-results").on('click', '.results-bookmark', function(){
    $(this).css('color', "red");
    favorites.push("<a href='" + $(this).data('url') + "'>" + $(this).data('name') + "</a>")
    localStorage.setItem('bookmarks', JSON.stringify(favorites));

    let bmArr = JSON.parse(localStorage.getItem('bookmarks'));

    let modalContent = "";
    for(let i = 0; i < bmArr.length; i++){
        modalContent += "<p>" + bmArr[i] + "</p>";
        modalContent += "<hr>";
    }

    $('#bookmarks-body').html(modalContent);
});

$("#number-menu .dropdown-item").on('click', function(event){
    event.preventDefault();
    $("#selected-value").text($(this).text()); 
    numOfResults = $(this).text();
    drawInitMap(); 
    getYelpSearchResults();
});


$("#food-menu .dropdown-item").on('click', function(event){
    event.preventDefault();
    $("#selected-food").text($(this).text()); 
    localStorage.setItem("input-category", $(this).text());
    drawInitMap(); 
    getYelpSearchResults();
});

});
// LOCAL STORAGE START


// Local Storage END