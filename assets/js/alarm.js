var timepicker = document.getElementById('timepicker');
	var setAlaramButton = document.getElementById('setAlaramButton');
	setAlaramButton.addEventListener('click', setalaram);
	var currentTime = document.getElementById('currentTime');
	var sound = document.getElementById('alarmaudio')
	createtable();
	currentTimeSet();
	var intInstance = setInterval(currentTimeSet,1000);
	function createtable(){
		var newarr = JSON.parse(localStorage.getItem('alaramtime'));
		var table = `<table class='table table-striped'><legend>Next Alarams</legend><th>Time</th><th>Action</th><tbody>`;
		if(newarr){
		newarr.forEach((item)=>{
		table += `<tr><td>`+item+`</td><td style = "cursor:pointer" onclick = "deleteAlaram('`+item+`',2)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></i></td></tr>`;
		});
		table += `</tbody></table>`;
		document.getElementById('alaramsPending').innerHTML = table;
		}
		
	}
	function setalaram(){
		var alaramTime = timepicker.value;
		if(alaramTime != ''){
			if(!localStorage.getItem('alaramtime')){
				var alaramTimeList = [];
				alaramTimeList.push(alaramTime);
				localStorage.setItem('alaramtime',JSON.stringify(alaramTimeList)); 
			}else{
				alaramTimeList = JSON.parse(localStorage.getItem('alaramtime'));
				
				if(alaramTimeList.includes(alaramTime)){
					alert('Already Added for this time');
					return;
				
				}
				alaramTimeList.push(alaramTime);
				localStorage.setItem('alaramtime',JSON.stringify(alaramTimeList)); 
			}
		}
		timepicker.value = '';
		createtable();
	}
	
	
	
	function currentTimeSet(){ 
		var timenow = new Date();
		var hours = timenow.getHours().toString().padStart(2, '0');
		var minutes = timenow.getMinutes().toString().padStart(2, '0');
		var sec = timenow.getSeconds().toString().padStart(2, '0');
		currentTime.textContent = hours+':'+minutes+':'+sec;
		
		if(localStorage.getItem('alaramtime') != '' && localStorage.getItem('alaramtime') != null){
		var alaramList = JSON.parse(localStorage.getItem('alaramtime'));
		
		
			if(alaramList.includes(hours+':'+minutes)){
					// alert();
				document.getElementById('stopAlaramButton').style.display = 'block';
				document.getElementById('snoozeAlaramButton').style.display = 'block';
				sound.play();
				localStorage.setItem('currentAlaram', hours+':'+minutes);
			}
		}
	}
	
	function removeItemFromTable(){
		var latestAlaram = localStorage.getItem('currentAlaram');
		deleteAlaram(latestAlaram,1)
	}
	
	function deleteAlaram(latestAlaram,type){
		if(type == 2){
		if(!confirm(`Are You Sure, Want to Delete :`+latestAlaram)){
			return;
		}
		}
		var alaramList = JSON.parse(localStorage.getItem('alaramtime'));
		const newArray = alaramList.filter(item => item !== latestAlaram);
		localStorage.setItem('alaramtime',JSON.stringify(newArray));
		localStorage.removeItem('currentAlaram');
		createtable();
	}
	function stopAlaram(){
		removeItemFromTable();
		document.getElementById('stopAlaramButton').style.display = 'none';
		document.getElementById('snoozeAlaramButton').style.display = 'none';
		stopaudio();
	}
	
	function snoozetime(){
	var latestAlaram = localStorage.getItem('currentAlaram');
	const newarr = latestAlaram.split(':');
		var dateobj = new Date();
		dateobj.setHours(newarr[0],newarr[1],'0','0');
		dateobj.setMinutes(dateobj.getMinutes() + 5)
		 
		 var newhours = (dateobj.getHours()).toString().padStart(2, '0');
		 var newminuts = (dateobj.getMinutes()).toString().padStart(2, '0');
		timepicker.value = (newhours+':'+newminuts).toString();
		setalaram();
		alert('Snoozed for 5 Min');
		removeItemFromTable();
		document.getElementById('stopAlaramButton').style.display = 'none';
		document.getElementById('snoozeAlaramButton').style.display = 'none';
		stopaudio();
	}
	
	function stopaudio(){
		sound.pause();
		sound.currentTime = 0;
	}