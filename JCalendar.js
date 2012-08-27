function JCalendar(month, year, type){

		var args = arguments.length,
			style = document.createElement('style'),
			currentDate = new Date();

		this.year = Number(year) || currentDate.getFullYear(), 
		this.weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		//type
		this.type = type || 'default';
		this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		this.month = isNaN(parseInt(month)) ? currentDate.getMonth()+1 : parseInt(month);
		this.h =[];
		// table inits
		this.statusBar = document.createElement('div');
		this.targetElem = document.getElementById('parent');
		this.tab = document.createElement('table');
		this.monthSpan = document.createElement('span');
		this.yearSpan = document.createElement('span');
		this.bankSpan = document.createElement('span');
		this.bankSpan.innerHTML = '&nbsp;';
		// left and right arrows for month navigation
		//create the link tag
		this.anchorLeft= document.createElement('span');
		this.anchorLeft.id = 'left';
		this.anchorRight =document.createElement('span');
		this.anchorRight.id = 'right';
		this.anchorLeft.textContent = "\u27F5";
		this.anchorRight.textContent = "\u27F6";

		style.type = 'text/css';
		style.innerHTML = '.cellStyle { display: inline-block; width: 22px; height: 22px; /*border: 1px solid grey;*/ padding: 5px; text-align: center; } .calStyle { width: 238px; min-width: 238px; }';
		document.getElementsByTagName('head')[0].appendChild(style);
}

JCalendar.prototype = {
	
	init: function() {
		this.buildUI();
	},

	buildUI: function(jsonObj) {
		var currentObj = this;

		this.daysForDates(this.month, this.year);
		
		//set some styling 
		this.targetElem.className ='calStyle';

		// month and year on the top status bar
		this.statusBar.className = 'statusBar';
		this.monthSpan.innerHTML = this.months[this.month-1];
		this.yearSpan.innerHTML = this.year;

		this.statusBar.appendChild(this.monthSpan);
		this.statusBar.appendChild(this.bankSpan);
		this.statusBar.appendChild(this.yearSpan);
		this.targetElem.appendChild(this.statusBar);


		// insert into status bar
		this.statusBar.insertBefore(this.anchorLeft, this.statusBar.childNodes[0]);
		this.statusBar.appendChild(this.anchorRight);

		// attach click handlers
		this.anchorLeft.addEventListener("click", function(e) {
			currentObj.navigateMonth(e,currentObj);
		}, false);
		this.anchorRight.addEventListener("click", function(e) {
			currentObj.navigateMonth(e,currentObj);
		}, false);

		this.tableDiv = document.createElement('Div');
		
		/* 
			building 6 x 7 matrix blocks 
			This block is always remains only refreshes its content every time of the next or previous click
		*/
		for(var i=0; i<7; i++) {
			var innerDiv = document.createElement('Div');
			for(var j=0; j<this.weekdays.length; j++) {
				var innerSpan = document.createElement('Span');
				innerSpan.className = "cellStyle";
				innerSpan.id = 'cell_' + i + '_' + j;
				if(i === 0) {
					innerSpan.innerHTML = this.weekdays[j];
				} else {
					innerSpan.innerHTML = '&nbsp;';
				}
				innerDiv.appendChild(innerSpan);
			}
			this.tableDiv.appendChild(innerDiv);
		}
		this.targetElem.appendChild(this.tableDiv);

		this.populateCalendar();
	},

	daysForDates: function(month, year)
	{
			if(typeof(month)==='number' && typeof(year) === 'number')
			{
				// this just finds out how many days a month has 
				var days = new Date(year, month, 0).getDate();

				//console.log(" Year: "+year+ " Month: "+ month + " Total Days: "+days);
				this.h = [];
				// Zeller's algorithm: http://en.wikipedia.org/wiki/Zeller's_congruence
				// returns an array of indices, 0 for Sunday, 1 for Monday and so on.
				for (var q = 1; q <= days; q++) {
					if (month < 3) { 
						month += 12; 
						year -= 1; 
					} 

					this.h.push((q + parseInt(((month + 1) * 26) / 10) + year + parseInt(year / 4) + 6 * parseInt(year / 100) + parseInt(year / 400) - 1) % 7);

				};
				//console.log('this.h = ' + this.h);
				//return h; // necessary ?
			}

	},

	populateCalendar: function() {
		var j = 1;
		for(var i = 0; i < this.h.length; i++) {
			var span = document.getElementById('cell_' + j + '_' + this.h[i]);
			span.innerHTML = (i+1);
			if(this.h[i] >= 6) {
				j++;
			}
		}
	},			

	navigateMonth: function(e,obj){
		//console.log("navigateMonth");
		var targ;
		if (!e) var e = window.event;
		if (e.target) targ = e.target;
		else if (e.srcElement) targ = e.srcElement;
		if (targ.nodeType == 3) { // defeat Safari bug
			targ = targ.parentNode;
		}
		
		//console.log('targ id = ' + targ.id + 'this.month = ' + obj.month + ' obj.year = ' + obj.year);
		if(targ.id == 'right') {
			if(obj.month < 12) {
				++obj.month;
			} else {
				obj.month = 1;
				++obj.year;
			}
		} else {
			if(obj.month > 1) {
				--obj.month;
			} else {
				obj.month = 12;
				--obj.year;
			}
		}
		//console.log('targ id = ' + targ.id + 'this.month = ' + obj.month + ' obj.year = ' + obj.year);
		obj.daysForDates(obj.month, obj.year);
		obj.monthSpan.innerHTML = obj.months[obj.month-1];
		obj.yearSpan.innerHTML = obj.year;
		obj.clearGrid();
		obj.populateCalendar();
	},

	clearGrid: function() {
		for(var i=1;i<7;i++) {
			for(var j=0; j<this.weekdays.length; j++) {
				var span = document.getElementById('cell_' + i + '_' + j);
				span.innerHTML = '&nbsp;';
			}
		}
	}
}