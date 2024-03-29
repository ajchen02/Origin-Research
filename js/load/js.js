var t=new Date()
var timestart=new Date()
var diff=0

function getWorkID(id,res_name){
	getNotNumDoc(id+'Title',`<div class="resource-title resource-name" style="color: `+colorText(res_name)[0]+`;"><tooltip id='`+id+`'>`+colorText(res_name)[1]+`</tooltip></div>`)
	getNotNumDoc(id+'Workmax',`<div class="resource-title" id="`+res_name+`WorkMaxID" style="width: 50px; color: #888"><tooltip id='`+id+`WorkMax'><u>制作最大</u></tooltip></div>`)
}

function ResearchSchedule(id){
	if(player['Research'+id+'Lv'].gte(player['Research'+id+'LvMax'])){
		return "<br>(<a style='color:"+colorText('ResearchTimes')[0]+"'>研究等级</a>:"+format(player['Research'+id+'Lv'],0)+"(Max))"
	}else{
		return "<br>("+format(player['Research'+id+'Now'],0)+"/"+format(player['Research'+id+'Max'],0)+"<a style='color:"+colorText('ResearchPoint')[0]+"'>研究进度</a>)<br>("+format(player['Research'+id+'Lv'],0)+"/"+format(player['Research'+id+'LvMax'],0)+"<a style='color:"+colorText('ResearchTimes')[0]+"'>研究等级</a>)"
	}
}

function ResearchScheduleTooltip(id,things){
	costFirst(id.substr(5),false,0)
	return '<div style="text-align: left;"><a style="color:'+colorText(tooltipNameCanResearch[things])[0]+'"><div style=";width: 50px; display: table-cell;">'+colorText(tooltipNameCanResearch[things])[1]+'</div></a><a><div style="width: 50px; display: table-cell">'+format(player[tooltipNameCanResearch[things]])+'</div>/'+format(tooltipCostCanResearch[things])+'</a></div>'
}

function getTooltipID(id,id2){
	let a = player.noneButtonID=='true' ? '<br>ID:'+id.substr(10) : ''
	getBuyNoDoc(id,`
	<button id='`+id+`ID' class="tree" onclick="Researching('`+id.substr(4)+`')">`+id2+a+`</button>
	`)
}

function getWorBtoID(id,action,use_name){
	getNotNumDoc(id,`<tooltip id='`+id+`'><button onclick="`+action+`">`+use_name+`</button></tooltip>`)
}

function getID(){
	for(i in main['resource']){
		getResourceID(i+'LoadResource',i)
		resourceAction(i)
	}

	for(i in main['resource']){
		let unlocked = true
		if(main['resource'][i]['unlocked']!=undefined){
			unlocked = main['resource'][i]['unlocked']()
		}
		if(main['resource'][i]['PR']!=undefined){
			ResearchResource(i+'LoadResearchResource',unlocked)
		}
	}

	for(i in main['action']){
		let unlocked = true
		if(main['action'][i]['unlocked']!=undefined){
			unlocked = main['action'][i]['unlocked']()
		}
		ResearchResource(i+'LoadAction',unlocked)
	}

	for(i in main['building']){
		let unlocked = true
		if(main['building'][i]['unlocked']!=undefined){
			unlocked = main['building'][i]['unlocked']()
		}
		ResearchResource(i+'LoadBuilding',unlocked)
	}

	if(player['Research0-3-0-10Lv'].gte(1)){
		Open('tab_workshop_unlocked')
	}else{
		Close('tab_workshop_unlocked')
	}

	document.getElementById("midColumn").style.height = window.innerHeight-17


	let w = 4
	if(window.innerWidth<1400){w = 3}
	if(window.innerWidth<1200){w = 2}
	if(window.innerWidth<950){w = 1}

	let actionBr = -1
	for(i in main['action']){
		let unlocked = true
		if(main['action'][i]['unlocked']!=undefined){
			unlocked = main['action'][i]['unlocked']()
		}
		actionBr += 1
		if(actionBr%w === 0 && actionBr!=0){
			document.getElementById(i+'LoadActionBrID').style.display = ''
		}else{
			document.getElementById(i+'LoadActionBrID').style.display = 'none'
		}
	}

	let buildingBr = -1
	for(i in main['building']){
		let unlocked = true
		if(main['building'][i]['unlocked']!=undefined){
			unlocked = main['building'][i]['unlocked']()
		}
		buildingBr += 1
		if(buildingBr%w === 0 && buildingBr!=0){
			document.getElementById(i+'LoadBuildingBrID').style.display = ''
		}else{
			document.getElementById(i+'LoadBuildingBrID').style.display = 'none'
		}
	}

	let researchResourceBr = -1
	for(i in main['resource']){
		let unlocked = true
		if(main['resource'][i]['unlocked']!=undefined){
			unlocked = main['resource'][i]['unlocked']()
		}
		if(main['resource'][i]['PR']!=undefined && unlocked){
			researchResourceBr += 1
			if(researchResourceBr%w === 0 && researchResourceBr!=0){
				document.getElementById(i+'LoadResearchResourceBrID').style.display = ''
			}else{
				document.getElementById(i+'LoadResearchResourceBrID').style.display = 'none'
			}
		}
	}


	let workBr = 0
	for(col=1;col<=allWork;col++){
		if(workBr%w === 0 && workBr!=0){
			document.getElementById('0-4-0-'+col+'-br').style.display = ''
			workBr += 1
		}else if($('#res-0-4-0-'+col+'ID').css('display')!='none'){
			document.getElementById('0-4-0-'+col+'-br').style.display = 'none'
			workBr += 1
		}else{
			document.getElementById('0-4-0-'+col+'-br').style.display = 'none'
		}
	}

	getNotNumDoc("autoSave",player.autoSave=="true" ? "开" : "关")
	getNotNumDoc("noneButtonID",player.noneButtonID=="true" ? "开" : "关")
}

setInterval(function(){
	t = new Date()
	var realDiff = n((Number(t.getTime())-timestart)/1000)
	diff = n(Math.min((Number(t.getTime())-timestart)/1000,1e100))
	//if(realDiff.gte(diff) &&!player.cheated){player.offlineSpeedup = player.offlineSpeedup.add(realDiff.sub(diff).add(1).pow(0.925).sub(1))}
	var offlineBoost = n(1).mul(player.devSpeed)
	diff=diff.mul(offlineBoost)
	timestart=t.getTime()
	
	if(player.autoSave=="true"){
		save()
	}else if(player.saveTick!='false_save'){
		player.saveTick = 'true'
	}
	if(player.saveTick=='true'){
		save()
		player.saveTick = 'false_save'
	}
	firstTab()
	getID()

	for(col=1;col<=allResearch;col++){
		maxResearch('0-3-0-'+col)
		costResearch('0-3-0-'+col)
		canResearch('0-3-0-'+col)
		finishResearch('0-3-0-'+col)
	}
}, 50)