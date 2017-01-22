/* 	Cool Javascript Find on this Page - Fixed Position Edition
	(or Version 6.0)
	
	Written by Jeff Baker on May 20, 2016.
	Copyright 2016 by Jeff Baker - 
	Version 6.0 created 5/20/2016
	Version 6.0c updated 7/15/2016
	http://www.seabreezecomputers.com/tips/find6.htm
	Paste the following javascript call in your HTML web page where
	you want a button called "Find" or for newer browsers
	a button with a svg drawing of a magnifying glass:

	<script type="text/javascript" id="cool_find_script" src="find6.js">
	</script>
	
	NOTE: Or if "lock_button" below is set to 1 then the find button will be
	locked in a fixed position at the bottom right corner of the browser window.
	
*/

// Create find_settings object
var coolfind = { 

/* EDIT THE FOLLOWING VARIABLES */
lock_button: 1, // 0 = Don't lock button at bottom of screen; 1 = Lock button in fixed position
find_root_node: null, // Leave as null to search entire doc or put id of div to search (ex: 'content').
test_mode : false,

/* DO NOT EDIT BELOW THIS LINE */
find_button_html: '', // Will be "Find" or svg magnifying glass
highlights: [], // Highlights array to hold each new span element
find_pointer: -1, // Which find are we currently highlighting
find_text: '', // Global variable of searched for text
found_highlight_rule: 0, // whether there is a highlight css rule
found_selected_rule: 0, // whether there is a selected css rule

};

coolfind.create_find_div = function()
{
	// Create the DIV
	var find_div = document.createElement("div");
	var el;
	var find_script = document.getElementById('cool_find_script');
	var find_html = "";
	var find_div_style = "display: inline-block; vertical-align: middle; z-index:200;";
	var button_style = "outline:0; background-color: rgba(255, 255, 255, 0.0); display: inline-block; min-height: 1.15em; min-width: 1.5em; max-width: 3em; vertical-align: middle; text-align: center; font-size: 1em;"+ // Version 6.0b - Added font-size: 1em; for "button" element to display properly
		"border: 0px inset black; background: rgba(21, 112, 166, 0.0); cursor: pointer; padding: 1px; margin: 4px; -webkit-user-select: none; -ms-user-select: none;";
	var menu_style = "color: rgba(254, 80, 0, 1); background-color: rgba(192, 192, 192, 0.0); display: none;";
	var input_style = "display: inline; max-width: 55%;"; // Version 6.0b - changed width: 55% to max-width: 55%
	if (coolfind.lock_button) menu_style += "float: left;";
	coolfind.addCss(".cool_find_btn {"+button_style+"}"); // Comment out this line if you are using your own css for the buttons
	coolfind.addCss(".cool_find_menu {"+menu_style+"}"); // Comment out this line if you are using your own css for the find menu
	coolfind.addCss(".cool_find_input {"+input_style+"}"); // Comment out this line if you are using your own css for the input search box
	
	// If browser does not support svg
	if (typeof SVGRect == "undefined")
		coolfind.find_button_html = "Find";
	else
		coolfind.find_button_html = '<style type="text/css">svg path{fill:grey} svg path:hover{fill:rgba(21, 112, 166, 1);} </style>' +
		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><path " d="M17.706 16.38c0.655-0.919 1.044-2.041 1.044-3.256 0-3.107-2.519-5.625-5.625-5.625s-5.625 2.518-5.625 5.625c0 3.106 2.518 5.625 5.625 5.625 1.215 0 2.336-0.389 3.256-1.044l4.519 4.519c0.366 0.366 0.96 0.366 1.326 0s0.366-0.959 0-1.326l-4.519-4.519zM16.345 15.019c-0.324 0.549-0.778 1.002-1.326 1.326-0.557 0.329-1.2 0.53-1.894 0.53-2.071 0-3.75-1.679-3.75-3.75s1.679-3.75 3.75-3.75c2.071 0 3.75 1.679 3.75 3.75 0 0.694-0.201 1.336-0.53 1.894zM15 0c-8.284 0-15 6.715-15 15s6.715 15 15 15 15-6.715 15-15-6.715-15-15-15zM15 27.656c-6.99 0-12.656-5.666-12.656-12.656s5.666-12.656 12.656-12.656 12.656 5.666 12.656 12.656c0 6.99-5.666 12.656-12.656 12.656z"></path></svg>';


		// coolfind.find_button_html = '<svg width="1.15em" height="1.15em" viewbox="0 0 30 30">'+
		// 	'<circle cx="18" cy="12" r="8" stroke="black" stroke-width="2" fill="#fff" fill-opacity="0.4" />'+
		// 	'<line x1="13" y1="17" x2="0" y2="30" stroke="black" stroke-width="2" />'+
		// 	'<line x1="10" y1="20" x2="0" y2="30" stroke="black" stroke-width="4" />'+
		// 	'</svg>';
	
	find_div.id = "cool_find_div";
	find_div.style.cssText = find_div_style;
	
	find_html += "<button class='cool_find_btn' id='cool_find_btn'"+ 
		" title='Find on this page' onclick='coolfind.find_menu(this)'>"+
		coolfind.find_button_html+"</button> "; 

	if (coolfind.lock_button)
	{
		find_div.style.position = "fixed";
		find_div.style.bottom = "3em";
		find_div.style.right = "1em";
	}
	find_script.parentNode.insertBefore(find_div, find_script.nextSibling);
	
	find_html += "<span class='cool_find_menu' id='cool_find_menu'>" +
		'<form onsubmit="return false;" style="display: inline">' +
		'<input type="search" class="cool_find_input" id="cool_find_text"' +
		' onchange="coolfind.resettext();" placeholder="Enter text to find">'+
		'<span id="cool_find_msg"> </span></form>';
	
		find_html += "<button class='cool_find_btn'"+ 
		//" style='"+button_style+"'"+ 
		" title='Find Previous' onclick='coolfind.findprev();'>" +
		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><path fill="rgba(21, 112, 166, 1)" d="M30 15c0-8.285-6.715-15-15-15s-15 6.715-15 15 6.715 15 15 15 15-6.715 15-15zM2.344 15c0-6.99 5.666-12.656 12.656-12.656s12.656 5.666 12.656 12.656c0 6.99-5.666 12.656-12.656 12.656s-12.656-5.666-12.656-12.656z"></path><path fill="rgba(21, 112, 166, 1)" d="M13.938 9.278l-5.25 9.034c-0.584 0.987-0.114 1.933 1.046 1.933h10.533c1.157 0 1.629-0.946 1.044-1.933l-5.249-8.962c-0.584-0.991-1.54-1.061-2.124-0.071z"></path></svg>' +
		"</button> ";
		
		find_html += "<button class='cool_find_btn' id='cool_find_next'"+ // Version 6.0b - Added id='cool_find_next' for accessibility
		//" style='"+button_style+"'"+
		" title='Find Next' onclick='coolfind.findit();'>" +
		'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><path fill="rgba(21, 112, 166, 1)" d="M30 15c0-8.285-6.715-15-15-15s-15 6.715-15 15 6.715 15 15 15 15-6.715 15-15zM2.344 15c0-6.99 5.666-12.656 12.656-12.656s12.656 5.666 12.656 12.656c0 6.99-5.666 12.656-12.656 12.656s-12.656-5.666-12.656-12.656z"></path><path fill="rgba(21, 112, 166, 1)" d="M16.062 20.125l5.25-8.53c0.584-0.987 0.114-1.429-1.045-1.429h-10.533c-1.157 0-1.629 0.442-1.044 1.429l5.249 8.71c0.584 0.991 1.54 0.809 2.124-0.18z"></path></svg>' +
		"</button> ";

	find_html += "</span>";
	find_div.innerHTML = find_html;
	
	// Check to see if css rules exist for hightlight and find_selected.
	var sheets = document.styleSheets;
	for (var i=0; i < sheets.length; i++)
	{
		// IE <= 8 uses rules; FF & Chrome and IE 9+ users cssRules
		var rules = (sheets[i].rules) ? sheets[i].rules : sheets[i].cssRules;
		if (rules != null)
		for (var j=0; j < rules.length; j++)
		{
			if (rules[j].selectorText == '.highlight')
				coolfind.found_highlight_rule = 1;
			else if (rules[j].selectorText == '.find_selected')
				coolfind.found_selected_rule = 1;
		}
	}
}


coolfind.find_menu =  function(that)
{
	var textbox = document.getElementById('cool_find_text');
	if (that.nextElementSibling.style.display != "inline-block")
	{
		that.nextElementSibling.style.display = 'inline-block';
		that.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 30 30"><path fill="rgba(21, 112, 166, 1)" d="M19.64 9.034l-4.64 4.64-4.64-4.64-1.326 1.326 4.64 4.64-4.64 4.64 1.326 1.326 4.64-4.64 4.64 4.64 1.326-1.326-4.64-4.64 4.64-4.64z"></path><path fill="rgba(21, 112, 166, 1)" d="M15 0c-8.285 0-15 6.715-15 15s6.715 15 15 15 15-6.715 15-15-6.715-15-15-15zM15 27.656c-6.99 0-12.656-5.666-12.656-12.656s5.666-12.656 12.656-12.656 12.656 5.666 12.656 12.656-5.666 12.656-12.656 12.656z"></path></svg>';
		that.title = "Close";
		// Make document look for enter key and esc key
		if (document.addEventListener) { // Chrome, Safari, FF, IE 9+
			document.addEventListener('keydown', coolfind.checkkey, false);
		} else { // IE < 9
			document.attachEvent('onkeydown', coolfind.checkkey);
		}
		// Put cursor focus in the text box
		textbox.focus(); 
		textbox.select(); // ver 5.1 - 10/17/2014 - Select the text to search for
		textbox.setSelectionRange(0, 9999); // ver. 5.3 - 5/15/2015 - iOS woould not select without this
	}
	else
	{
		that.nextElementSibling.style.display = 'none';
		that.innerHTML = coolfind.find_button_html;
		that.title = "Find on this page";
		coolfind.unhighlight(); // Remove highlights of any previous finds - ver 5.1 - 10/17/2014
		// Make document no longer look for enter key and esc key
		if (document.removeEventListener) // Chrome, Safari, FF, IE 9+
			document.removeEventListener('keydown', coolfind.checkkey, false);
		else // IE < 9
			document.detachEvent('onkeydown', coolfind.checkkey);
	}
}


coolfind.addCss = function(css)
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


coolfind.highlight = function(word, node)
{
	if (!node)
		node = document.body;
	
	//var re = new RegExp(word, "i"); // regular expression of the search term // Ver 6.0c - Not using regular expressions search now
	
	for (node=node.firstChild; node; node=node.nextSibling)
	{	
		//console.log(node.nodeName);
		if (node.nodeType == 3) // text node
		{
			var n = node;
			//console.log(n.nodeValue);
			var match_pos = 0;
			//for (match_pos; match_pos > -1; n=after)
			{	
				//match_pos = n.nodeValue.search(re); // Ver 5.3b - Now NOT using regular expression because couldn't search for $ or ^
				match_pos = n.nodeValue.toLowerCase().indexOf(word.toLowerCase()); // Ver 5.3b - Using toLowerCase().indexOf instead
				
				if (match_pos > -1) // if we found a match
				{
					var before = n.nodeValue.substr(0, match_pos); // split into a part before the match
					var middle = n.nodeValue.substr(match_pos, word.length); // the matched word to preserve case
					//var after = n.splitText(match_pos+word.length);		
					var after = document.createTextNode(n.nodeValue.substr(match_pos+word.length)); // and the part after the match	
					var highlight_span = document.createElement("span"); // create a span in the middle
			        if (coolfind.found_highlight_rule == 1)
						highlight_span.className = "highlight";
					else 
						highlight_span.style.backgroundColor = "yellow";	
			        
					highlight_span.appendChild(document.createTextNode(middle)); // insert word as textNode in new span
					n.nodeValue = before; // Turn node data into before
					n.parentNode.insertBefore(after, n.nextSibling); // insert after
		            n.parentNode.insertBefore(highlight_span, n.nextSibling); // insert new span
		           	coolfind.highlights.push(highlight_span); // add new span to highlights array
		           	highlight_span.id = "highlight_span"+coolfind.highlights.length;
					node=node.nextSibling; // Advance to next node or we get stuck in a loop because we created a span (child)
				}
			}
		}
		else // if not text node then it must be another element
		{
			// nodeType 1 = element
			if (node.nodeType == 1 && node.nodeName.match(/textarea/i) && !coolfind.getStyle(node, "display").match(/none/i)) 
				coolfind.textarea2pre(node);
			else
			{
			if (node.nodeType == 1 && !coolfind.getStyle(node, "visibility").match(/hidden/i)) // Dont search in hidden elements
			if (node.nodeType == 1 && !coolfind.getStyle(node, "display").match(/none/i)) // Dont search in display:none elements
			coolfind.highlight(word, node);
			}
		}
	}
	

} // end function highlight(word, node)


coolfind.unhighlight = function()
{
	for (var i = 0; i < coolfind.highlights.length; i++)
	{
		
		var the_text_node = coolfind.highlights[i].firstChild; // firstChild is the textnode in the highlighted span
	
		var parent_node = coolfind.highlights[i].parentNode; // the parent element of the highlighted span
		
		// First replace each span with its text node nodeValue
		if (coolfind.highlights[i].parentNode)
		{
			coolfind.highlights[i].parentNode.replaceChild(the_text_node, coolfind.highlights[i]);
			if (i == coolfind.find_pointer) coolfind.selectElementContents(the_text_node); // ver 5.1 - 10/17/2014 - select current find
			parent_node.normalize(); // The normalize() method removes empty Text nodes, and joins adjacent Text nodes in an element
			coolfind.normalize(parent_node); // Ver 5.2 - 3/10/2015 - normalize() is incorrect in IE. It will combine text nodes but may leave empty text nodes. So added normalize(node) function below		
		}
	}
	// Now reset highlights array
	coolfind.highlights = [];
	coolfind.find_pointer = -1; // ver 5.1 - 10/17/2014
} // end function unhighlight()


coolfind.normalize = function(node) {
//http://stackoverflow.com/questions/22337498/why-does-ie11-handle-node-normalize-incorrectly-for-the-minus-symbol
  if (!node) { return; }
  if (node.nodeType == 3) {
    while (node.nextSibling && node.nextSibling.nodeType == 3) {
      node.nodeValue += node.nextSibling.nodeValue;
      node.parentNode.removeChild(node.nextSibling);
    }
  } else {
    coolfind.normalize(node.firstChild);
  }
  coolfind.normalize(node.nextSibling);
}


coolfind.findit = function () 
{
	var cool_find_msg = document.getElementById('cool_find_msg');
	var findwindow = document.getElementById('cool_find_menu');
	
	// put the value of the textbox in string
	var string = document.getElementById('cool_find_text').value;
	
	// 8-9-2010 Turn DIV to hidden just while searching so doesn't find the text in the window
	findwindow.style.visibility = 'hidden';
	//findwindow.style.display = 'none';
		
	// if the text has not been changed and we have previous finds
	if (coolfind.find_text.toLowerCase() == document.getElementById('cool_find_text').value.toLowerCase() &&
		coolfind.find_pointer >= 0) 
	{	
		coolfind.findnext(); // Find the next occurrence
	}
	else
	{
		coolfind.unhighlight(); // Remove highlights of any previous finds
		
		if (string == '') // if empty string
		{
			cool_find_msg.innerHTML = "";
			findwindow.style.visibility = 'visible';
			return;
		}
		
		coolfind.find_text = string;
		
		// Ver 5.0a - 7/18/2014. Next four lines because find_root_node won't exist until doc loads
		if (coolfind.find_root_node != null)
			var node = document.getElementById(coolfind.find_root_node);
		else
			var node = null;
		
		coolfind.highlight(string, node); // highlight all occurrences of search string
		
		if (coolfind.highlights.length > 0) // if we found occurences
		{
			coolfind.find_pointer = -1;
			coolfind.findnext(); // Find first occurrence
		}
		else
		{
			cool_find_msg.innerHTML = "&nbsp;&nbsp;<b>0 of 0</b>"; // ver 5.1 - 10/17/2014 - changed from "Not Found"
			coolfind.find_pointer = -1;	
		}
	}
	findwindow.style.visibility = 'visible';
	//findwindow.style.display = 'block';	
	
}  // end function findit()


coolfind.findnext = function()
{
	var current_find;
	
	if (coolfind.find_pointer != -1) // if not first find
	{
		current_find = coolfind.highlights[coolfind.find_pointer];
		
		// Turn current find back to yellow
		if (coolfind.found_highlight_rule == 1)
			current_find.className = "highlight";
		else 
			current_find.style.backgroundColor = "yellow";
	}	
	
	coolfind.find_pointer++;
	
	if (coolfind.find_pointer >= coolfind.highlights.length) // if we reached the end
		coolfind.find_pointer = 0; // go back to first find
	
	var display_find = coolfind.find_pointer+1;
	
	cool_find_msg.innerHTML = "&nbsp;&nbsp;" + display_find+" of "+coolfind.highlights.length;

	current_find = coolfind.highlights[coolfind.find_pointer];
	
	// Turn selected find orange or add .find_selected css class to it
	if (coolfind.found_selected_rule == 1)
			current_find.className = "find_selected";
		else 
			current_find.style.backgroundColor = "orange";
			
	//coolfind.highlights[find_pointer].scrollIntoView(); // Scroll to selected element
	coolfind.scrollToPosition(coolfind.highlights[coolfind.find_pointer]);
	
} // end coolfind.coolfind.findnext()



// This function is to find backwards by pressing the Prev button
coolfind.findprev = function()
{
	var cool_find_msg = document.getElementById('cool_find_msg');
	var current_find;
	
	if (coolfind.highlights.length < 1) return;
	
	if (coolfind.find_pointer != -1) // if not first find
	{
		current_find = coolfind.highlights[coolfind.find_pointer];
		
		// Turn current find back to yellow
		if (coolfind.found_highlight_rule == 1)
			current_find.className = "highlight";
		else 
			current_find.style.backgroundColor = "yellow";
	}	
	
	coolfind.find_pointer--;
	
	if (coolfind.find_pointer < 0) // if we reached the beginning
			coolfind.find_pointer = coolfind.highlights.length-1; // go back to last find
	
	var display_find = coolfind.find_pointer+1;
	
	cool_find_msg.innerHTML = "&nbsp;&nbsp;" +  display_find+" of "+coolfind.highlights.length;

	current_find = coolfind.highlights[coolfind.find_pointer];
	
	// Turn selected find orange or add .find_selected css class to it
	if (coolfind.found_selected_rule == 1)
			current_find.className = "find_selected";
		else 
			current_find.style.backgroundColor = "orange";
			
	//coolfind.highlights[coolfind.find_pointer].scrollIntoView(); // Scroll to selected element
	coolfind.scrollToPosition(coolfind.highlights[coolfind.find_pointer]);
	
} // end coolfind.coolfind.findprev()


// This function looks for the ENTER key (13) 
// while the find window is open, so that if the user
// presses ENTER it will do the find next
coolfind.checkkey = function(e)
{	
	var keycode;
	if (window.event)  // if ie
		keycode = window.event.keyCode;
	else // if Firefox or Netscape
		keycode = e.which;
	
	//cool_find_msg.innerHTML = keycode;
	
	if (keycode == 13) // if ENTER key
	{	
	}

	if (keycode == 13) // if ENTER key
	{	
		// ver 5.1 - 10/17/2014 - Blur on search so keyboard closes on iphone and android
		if (window.event && event.srcElement.id.match(/cool_find_text/i)) { event.srcElement.blur(); document.getElementById("cool_find_next").focus(); } // Version 6.0b - Added focus to find_next btn
		else if (e && e.target.id.match(/cool_find_text/i)) { e.target.blur(); document.getElementById("cool_find_next").focus(); } // Version 6.0b - Added focus to find_next btn
		if (document.activeElement.className != "cool_find_btn") // Version 6.0b - For accessibility, let find_next and find_prev buttons work with keyboard
			coolfind.findit(); // call findit() function (like pressing NEXT)	
	}
	else if (keycode == 27) // ESC key // Ver 5.1 - 10/17/2014
	{
		coolfind.find_menu(document.getElementById('cool_find_btn')); // Close find window on escape key pressed
	}
} // end function coolfind.checkkey()



// This function resets the txt selection pointer to the
// beginning of the body so that we can search from the
// beginning for the new search string when somebody
// enters new text in the find box
coolfind.resettext = function()
{
	if (coolfind.find_text.toLowerCase() != document.getElementById('cool_find_text').value.toLowerCase())
		coolfind.unhighlight(); // Remove highlights of any previous finds
	
} // end function resettext()


coolfind.scrollToPosition = function(field)
{  
   // This function scrolls to the DIV called 'edited'
   // It is called with onload.  'edited' only exists if
   // they just edited a comment or the last comment
   // if they just sent a comment
	var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	var scrollBottom = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) + scrollTop;
	var scrollRight = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + scrollLeft;

   
   if (field)
   {
	   var theElement = field;  
	   var elemPosX = theElement.offsetLeft;  
	   var elemPosY = theElement.offsetTop;  
	   theElement = theElement.offsetParent;  
	   	while(theElement != null)
	   	{  
			elemPosX += theElement.offsetLeft   
			elemPosY += theElement.offsetTop;  
			theElement = theElement.offsetParent; 
		} 
		// Only scroll to element if it is out of the current screen
		if (elemPosX < scrollLeft || elemPosX > scrollRight ||
			elemPosY < scrollTop || elemPosY > scrollBottom) 
		//window.scrollTo(elemPosX ,elemPosY); 
		field.scrollIntoView();
	}
}  // end function scrollToPosition()


/* It is not possible to get certain styles set in css such as display using 
the normal javascript.  So we have to use this function taken from:
http://www.quirksmode.org/dom/getstyles.html */
coolfind.getStyle = function(el,styleProp)
{
	// if el is a string of the id or the actual object of the element
	var x = (document.getElementById(el)) ? document.getElementById(el) : el;
	if (x.currentStyle) // IE
		var y = x.currentStyle[styleProp];
	else if (window.getComputedStyle)  // FF
		var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
	return y;
}


coolfind.textarea2pre = function(el)
{		
	// el is the textarea element
	
	// If a pre has already been created for this textarea element then use it
	if (el.nextSibling && el.nextSibling.id && el.nextSibling.id.match(/pre_/i))
		var pre = el.nextsibling;
	else
		var pre = document.createElement("pre");
	
	var the_text = el.value; // All the text in the textarea		
	
	// replace <>" with entities
	the_text = the_text.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
	//var text_node = document.createTextNode(the_text); // create text node for pre with text in it
	//pre.appendChild(text_node); // add text_node to pre			
	pre.innerHTML = the_text;
	
	// Copy the complete HTML style from the textarea to the pre
	var completeStyle = "";
	if (el.currentStyle) // IE
	{
		var elStyle = el.currentStyle;
	    for (var k in elStyle) { completeStyle += k + ":" + elStyle[k] + ";"; }
	    //pre.style.cssText = completeStyle;
	    pre.style.border = "1px solid black"; // border not copying correctly in IE
	}
	else // webkit
	{
	    completeStyle = window.getComputedStyle(el, null).cssText;
		pre.style.cssText = completeStyle; // Everything copies fine in Chrome
	}
	
	el.parentNode.insertBefore(pre, el.nextSibling); // insert pre after textarea
	
	// If textarea blur then turn pre back on and textarea off
	el.onblur = function() { this.style.display = "none"; pre.style.display = "block"; };
	// If textarea changes then put new value back in pre
	el.onchange = function() { pre.innerHTML = el.value.replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); };
	
	el.style.display = "none"; // hide textarea
	pre.id = "pre_"+coolfind.highlights.length; // Add id to pre
	
	// Set onclick to turn pre off and turn textarea back on and perform a click on the textarea
	// for a possible onclick="this.select()" for the textarea
	pre.onclick = function() {this.style.display = "none"; el.style.display = "block"; el.focus(); el.click()};
	
	// this.parentNode.removeChild(this); // old remove pre in onclick function above
	 
} // end function textarea2pre(el)


// ver 5.1 - 10/17/2014
coolfind.selectElementContents = function(el) 
{
    /* http://stackoverflow.com/questions/8019534/how-can-i-use-javascript-to-select-text-in-a-pre-node-block */
	if (window.getSelection && document.createRange) {
        // IE 9 and non-IE
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (document.body.createTextRange) {
        // IE < 9
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
        //textRange.execCommand("Copy");
    }
} // end function selectElementContents(el) 


coolfind.create_find_div();