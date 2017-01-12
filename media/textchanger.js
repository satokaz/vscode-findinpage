/* Cool Javascript Text Changer
Version 1.0
Written by Jeff Baker on May 19, 2016.
Copyright 2016 by Jeff Baker - 
http://www.seabreezecomputers.com/tips/textchanger.htm

Paste the following javascript call in your HTML web page where
you want the text changer button to appear:

<script id="cool_textchanger_script" type="text/javascript" src="textchanger.js"></script>
*/

// Create text_settings object
var text_settings = { 

/* EDIT THE FOLLOWING VARIABLES */
hide_options: 1, // 0 = Don't hide options in a button; 1 = Hide options in a button
button_html: "A+", // Only used if hide_options = 1
lock_button: 1, // 0 = Don't lock button at bottom of screen; 1 = Lock button
text_color_button : 1, // 0 = Don't show text color button; 1 = Show text color button
bg_color_button : 1, // 0 = Don't show bg color button; 1 = Show bg color button
font_button : 1, // Don't show font button; 1 = Show font button
reset_button : 1, // 0 = Don't show reset button; 1 = Show reset button
save_settings : 1, // 0 = Don't save; 1 = Save text settings in a cookie
test_mode : false,

/* DO NOT EDIT BELOW THIS LINE */
font_times : 1, /* Current multiplyer (1.2 * 100 = 120) or 1.2X is the same as 120% */
timers : {}, 
current_options : {},
};

var font_list = [
"Default Font",
"Arial", 
"Helvetica", 
"sans-serif", 
"Tahoma", 
"Trebuchet MS", 
"Verdana", 
"Lucida Sans Unicode", 
"Impact", 
"Arial Black", 
"Comic Sans MS", 
"cursive", 
"Courier", 
"Courier New", 
"monospace", 
"Lucida Console", 
"Book Antiqua", 
"Bookman Old Style", 
"Georgia", 
"Palatino Linotype", 
"serif", 
"Times", 
"Times New Roman"
];

var color_list = [
"Default Color",
"Black",
"Brown",
"Blue",
"Purple",
"Green",
"Yellow",
"Orange",
"Red",
"Grey",
"Beige",
"White"
];



function create_textchanger_div()
{
	// Create the DIV
	var textchanger_div = document.createElement("div");
	var el;
	var textchanger_script = document.getElementById('cool_textchanger_script');
	var textchanger_html = "";
	var textchanger_div_style = "display: inline-block; vertical-align: middle; z-index:200;";
	var button_style = "display: inline-block; min-width: 2em; max-width: 3em; vertical-align: middle; text-align: center;"+
		"border: 1px solid black; background: lightgray; cursor: pointer; padding: 1px; margin: 3px 2px; -webkit-user-select:none; -ms-user-select: none;";
	var menu_style = "background-color: #e5e5e5;";
	if (text_settings.lock_button) menu_style += "float: left;";
	addCss(".cool_textchanger_btn {"+button_style+"}"); // Comment out this line if you are using your own css for the buttons
	addCss(".cool_textchanger_menu {"+menu_style+"}"); // Comment out this line if you are using your own css for the text settings menu
	// Now we will add transition to the style. Can't transition from width:0px to auto so use max-width instead 
	var transition_style = "transition: all 300ms; overflow: hidden;";
	
	textchanger_div.id = "cool_textchanger_div";
	textchanger_div.style.cssText = textchanger_div_style;
	
	if (text_settings.hide_options)
	{
		textchanger_html += "<span class='cool_textchanger_btn'"+ 
			//" style='"+button_style+"'"+
			" title='Text Settings' onclick='text_menu(this)'>"+
			text_settings.button_html+"</span> "; 
		textchanger_div.style.cssText += transition_style; 
	}
	if (text_settings.lock_button)
	{
		textchanger_div.style.position = "fixed";
		textchanger_div.style.bottom = "0em";
		textchanger_div.style.right = "1em";
	}
	textchanger_script.parentNode.insertBefore(textchanger_div, textchanger_script.nextSibling);
	
	textchanger_html += "<span class='cool_textchanger_menu'";
	if (text_settings.hide_options) textchanger_html += " style='display: none;'";
	textchanger_html += ">";
	
	textchanger_html += "<span class='cool_textchanger_btn'"+ 
		//" style='"+button_style+"'"+ 
		" title='ALT+' onclick='change_font(\"font-size\", \"up\")'>+</span> "+
		"<span class='cool_textchanger_btn'"+ 
		//" style='"+button_style+"'"+
		" title='ALT-' onclick='change_font(\"font-size\", \"down\")'>-</span> "+
		"Text Size: <span class='textchanger_size_span' id='textchanger_size_span'>1X</span> ";
		
	var inputElem = document.createElement('input'); // To test for input type='color' support
	inputElem.setAttribute('type', 'color');
	inputElem.value = "Hi";
	if (text_settings.text_color_button)
	{	
		if (inputElem.type == "text" || inputElem.value == "Hi") // Browser does not support type="color" color picker
		{
			textchanger_html += "<select name='fontcolor' id='fontcolor' onchange='change_font(\"color\", this.value)'>";
			for (var i = 0; i < color_list.length; i++)
			{
				var color = color_list[i];
				textchanger_html += "<option value='"+color+"' style='color:"+color+"'>"+color+"</option>";
			}
			textchanger_html += "</select> ";
		}
		else
		{
			textchanger_html += '<label id="fontcolorlabel" for="fontcolor" class="cool_textchanger_btn">Color</label>'+
			'<input id="fontcolor" style="visibility:hidden; width:0px" oninput="change_font(\'color\', this.value);" type="color" value="#FFEEDD" /></label>';
		}
	}
	if (text_settings.bg_color_button)
	{	
		if (inputElem.type == "text" || inputElem.value == "Hi") // Browser does not support type="color" color picker
		{
			textchanger_html += "<select name='bgcolor' id='bgcolor' onchange='change_font(\"background-color\", this.value)'>";
			for (var i = 0; i < color_list.length; i++)
			{
				var color = color_list[i];
				textchanger_html += "<option value='"+color+"' style='background-color:"+color+"'>"+color+"</option>";
			}
			textchanger_html += "</select> ";
		}
		else
		{
			textchanger_html += '<label id="bgcolorlabel" for="bgcolor" class="cool_textchanger_btn">BgCol</label>'+
			'<input id="bgcolor" style="visibility:hidden; width:0px" oninput="change_font(\'background-color\', this.value);" type="color" value="#FFEEDD" /></label>';
		}
	}
	if (text_settings.font_button)
	{	
		//textchanger_html += "<span style='"+button_style+"' title='Change font' onclick='show_fontlist();'>Font</span> ";
		textchanger_html += "<select name='fontlist' id='fontlist' onchange='change_font(\"font-family\", this.value)'>";
		for (var i = 0; i < font_list.length; i++)
			textchanger_html += "<option value='"+font_list[i]+"'>"+font_list[i]+"</option>";
		textchanger_html += "</select> ";
	}
	if (text_settings.reset_button)
	{
		textchanger_html += "<span class='cool_textchanger_btn' title='Reset(Alt-BackSpace)' onclick='reset_text();'>Reset</span> ";
	}
	textchanger_html += "</span>";
	textchanger_div.innerHTML = textchanger_html;
}


function text_menu(that)
{
	//var textchanger_div = document.getElementById('textchanger_div');
	if (that.nextElementSibling.style.display != "inline-block")
	{
		that.nextElementSibling.style.display = 'inline-block';
		/*that.parentElement.style.maxWidth = "100%";
		that.parentElement.style.maxHeight = "100%"; 
		that.nextElementSibling.style.width = "100%";
		that.nextElementSibling.style.height = "100%"; */
		that.innerHTML = "X";
		that.title = "Close";
	}
	else
	{
		that.nextElementSibling.style.display = 'none';
		/*that.parentElement.style.maxWidth = "3em";
		that.parentElement.style.maxHeight = "100%"; 
		that.nextElementSibling.style.width = '0px';
		that.nextElementSibling.style.height = '0px'; */
		//setTimeout(function(){ that.nextElementSibling.style.display = 'none';} , 20);
		that.innerHTML = text_settings.button_html;
		that.title = "Text Settings";
	}
}


function addEvent(element, myEvent, fnc) 
{ 
	return ((element.attachEvent) ? element.attachEvent('on' + myEvent, fnc) : element.addEventListener(myEvent, fnc, false)); 
}


function addCss(css)
{
	// Example: addCss(".cool_textchanger_btn { display: inline-block; min-width: 2em; max-width: 3em; }");
	var style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) // IE < 9
		style.styleSheet.cssText = css;
	else 
		style.appendChild(document.createTextNode(css));
	
	document.getElementsByTagName("head")[0].appendChild(style);
	
}


function save_style(option)
{
	// option = "font-size", "font-family", "background-color" or "color"
	var elems = document.getElementsByTagName("*"); // Note we removed .body so we could get body tag as well and not just children of body
	for (var i=0; i<elems.length; i++)
	{
		var el = elems[i];
		if (el.getAttribute('data-default-'+option)) // then it will have "data-default-color" attribute
		{
			var default_style = el.getAttribute('data-default-'+option);
		}
		else
		{
			var default_style = document.defaultView.getComputedStyle(el,null).getPropertyValue(option);
			el.setAttribute('data-default-'+option, default_style);
		}
	}
	
} // end function save_style()


function change_font(option, value)
{
	// option = "font-size", "font-family", "background-color" or "color"
	save_style(option); // In case they have dynamic content like Google.com does
	
	clearTimeout(text_settings.timers[option]);
	
	var font_times = text_settings.font_times; // Get current text multiplyer
	
	if (value == "up")
		font_times = Math.round((font_times + 0.2) * 10) / 10;
	else if (value == "down") 
	{	
		if  (font_times > 0.2) // Smaller than this is 0px
			font_times = Math.round((font_times - 0.2) * 10) / 10;
		else return;
	}
	else if (value == "default")
		font_times = 1;
	else if (!isNaN(value)) // if IS a number
		font_times = value;	
	
	var elems = document.getElementsByTagName("*"); // Note we removed .body so we could get body tag as well and not just children of body
	for (var i=0; i<elems.length; i++)
	{
		var el = elems[i];
		// If we have changed the color of this element already
		if (el.getAttribute('data-default-'+option)) // then it will have "data-default-color" attribute
		{
			var default_value = el.getAttribute('data-default-'+option);
		}
		else
		{
			var default_value = document.defaultView.getComputedStyle(el,null).getPropertyValue(option);
			el.setAttribute('data-default-'+option, default_value);
		}
		
		var current_value = document.defaultView.getComputedStyle(el,null).getPropertyValue(option); 
		
		if (option.match(/size/i))
			value = Math.round(parseInt(default_value) * font_times) + "px";
		else if (option.match(/color/i))
		{
			current_value = rgb2hex(current_value);
			var default_value_hex = rgb2hex(default_value);
		}	
		
		if (current_value != value)
		{	
			if (text_settings.test_mode && el.nodeName != "OPTION") 
				console.log(i+". "+el.nodeName+". Current:"+current_value+". Default:"+default_value+". New:"+value); 
			if ((value == "reset" || value.indexOf("Default") != -1) && current_value != default_value_hex && el.nodeName != "OPTION")
			{
				el.style.setProperty(option, default_value, "important"); // last option is priority. Set to null if no priority
			}
			else if (option.match(/color/i) && ( (el.parentElement && el.parentElement.id == "cool_textchanger_div")
						|| (el.parentElement && el.parentElement.parentElement && el.parentElement.parentElement.id == "cool_textchanger_div") ) )
			{
				// Don't change color of elements in the textchanger div
			}
			else if (el.nodeName != "OPTION")
				el.style.setProperty(option, value, "important");
			
			if (option.match(/color/i) && el.nodeName == "A") // if anchor element
				el.style.textDecoration = "underline"; // Add underline so they know where links are
		}
	}
	
	if (option.match(/size/i) && font_times != text_settings.font_times)
	{
		// Show font_times in icon badge
		document.getElementById('textchanger_size_span').innerHTML = font_times+"X";
		var spans = document.getElementsByClassName('textchanger_size_span');
		for (var k = 0; k < spans.length; k++)
			spans[k].innerHTML = font_times+"X";
		// save to storage
		save_to_storage("font-times", font_times);
		text_settings.font_times = font_times;
	}
	else if (text_settings.current_options[option] != value)
	{
		// save to storage
		save_to_storage(option, value);	
		text_settings.current_options[option] = value; // save current color or font, etc...
	}
	
	// For pages with dynamic content recall this function
	text_settings.timers[option] = setTimeout(function()
	{
		change_font(option, value);
		return;
	} , 500);
	
} // end function change_font()



function rgb2hex(value) 
{
	if (value.indexOf("rgb") == -1) return; // IE has "transparent" for background
	var rgb_array = value.match(/\d+/g);
	//console.log(value);
	//console.log(rgb_array);
	var rgb = rgb_array[2] | (rgb_array[1] << 8) | (rgb_array[0] << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}
  
function reset_text()
{
	change_font("font-size", "default");	
	change_font("color", "reset");
	change_font("background-color", "reset");	
	change_font("font-family", "reset");
	document.getElementById("fontlist").selectedIndex = 0;
	document.getElementById("fontcolor").selectedIndex = 0;
	document.getElementById("bgcolor").selectedIndex = 0;
	// Stop all timers
	for (var key in text_settings.timers) 
	{
   		if (text_settings.timers.hasOwnProperty(key)) 
		{
      		clearTimeout(text_settings.timers[key]);
		}
   }
}


function keyboard(event)
{ 
	if (!event) event = window.event; // for older IE <= 9
	var key = (!event ? event.keyCode : event.which); // key pressed in unicode
	var actualkey = String.fromCharCode(key); // convert key pressed to letter
	var ctrl_key = event.ctrlKey;
	var alt_key = event.altKey;
	var shift_key = event.shiftKey;
	var cancel_event = 0;	
	
	if (key)
	{
		if (text_settings.test_mode) console.log(actualkey);	
	}
	if (shift_key)
	{
		if (text_settings.test_mode) console.log("shift");	
	}
	if (ctrl_key)
	{
		if (text_settings.test_mode) console.log("ctrl");
	}
	if (alt_key)
	{
		if (text_settings.test_mode) console.log("alt");
		if (actualkey == "T")
		{
			var bgcolor = document.bgColor;
			var flash_bgcolor = "red";
			if (text_settings.test_mode == false) 
			{
				text_settings.test_mode = true;
				flash_bgcolor = "green";
			}
			else 
				text_settings.test_mode = false;
				
			document.bgColor = flash_bgcolor;
			setTimeout(function()
			{
				document.bgColor = bgcolor; 
				return;
			} , 250);
			 
		}
		else if (key == 187) // minus key
		{
			change_font("font-size", "up");
		}
		else if (key == 189) // plus key
		{
			change_font("font-size", "down");
		}
		else if (key == 8) // backspace
		{
			//change_fontsize("default");	
			reset_text();
		}
	}

	if (cancel_event)
		if (window.event) // case :if it is IE event
		{
			window.event.returnValue = null;
			window.event.cancelBubble = true;
			event.keyCode=0;
		}
		else // case: if it is firefox event
		{
			//Event.stop(e);
			ev.preventDefault();
		}
		else // if not cancel_event but is ctrl key
			return;	
}

function save_to_storage(option, value)
{
	if (text_settings.save_settings)
	{
		var expire = 365; // 365 days
		if (value == 1 || /reset|Default/i.test(value))
			expire = -1; // Delete cookie	
		
		setCookie(option, value, expire);
		if (text_settings.test_mode) console.log("setcookie:"+option+":"+value);			
	}	
}

function get_from_storage()
{
	var text_options = ["font-times", "font-family", "color", "background-color"];
	
	if (text_settings.save_settings)
	{
		for (var i=0; i < text_options.length; i++)
		{
			var option = text_options[i];
			var value = getCookie(option);
			if (value != "") // If not empty
			{
				if (text_settings.test_mode) console.log("getcookie:"+option+":"+value);
				if (option == "font-times")
				{
					option = "font-size";
					value = parseFloat(value);
				}
				else if (option == "font-family")
					document.getElementById("fontlist").value = value;
				else if (option == "color")
					document.getElementById("fontcolor").value = value;
				else if (option == "background-color")
					document.getElementById("bgcolor").value = value;
				change_font(option, value);
			}	
		}
	}
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function stop_timeouts()
{
	var id = setTimeout(function() {}, 0);
	
	while (id--) {
	    clearTimeout(id); // will do nothing if no timeout with id is present
	}
	// NOTE: Must call stop_timeouts() with () in console for it to work!!!
}

/* This script is only going to show with IE9+, Chrome, Safari, FF */
if (document.defaultView && document.defaultView.getComputedStyle)
{
	create_textchanger_div();
	
	if (document.addEventListener) // Chrome, Safari, FF, IE 9+
		document.addEventListener('keydown',function(event) { keyboard(event); },false);
	else // IE < 9
		document.attachEvent('onkeydown',function(event) { keyboard(event); }); // Version 1.0a - Added 'on' to 'keydown'
		
	document.addEventListener('DOMContentLoaded', function(event) { get_from_storage(); }, false);
	//get_from_storage();
	//change_font("font-size", 1.2);
}
