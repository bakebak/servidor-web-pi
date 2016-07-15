function hideButton(){
	$('.switch').hide();
}

function showButton(){
	$('.switch').fadeIn(1000);
}

function clickButton(){
	$('#button').click(function(){
    	var state = $('#button').is(":checked");
    	$(this).prop('disabled', true);
    	if(state===true){
    		setTimeout(function(){
    			$('#button').attr('checked', false);
    			$('#button').prop('disabled', false);
    		},3000);
    	}
	});
}

$(document).ready(function(){
    hideButton();
    showButton();
    clickButton();
});