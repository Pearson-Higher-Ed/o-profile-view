/*global require*/
var ProfileView =require('../../main').UserProfileView;
var UProfileView;

document.addEventListener("DOMContentLoaded", function() {
	"use strict";
	var token = document.getElementById('htmlToken').value;
  var piid = document.getElementById('htmlPIid').value
	var url = document.getElementById('htmlURL').value
	// make a new UserProfileView
	UProfileView = new ProfileView(url, token);
	// attach it to the  demoProfile tag
	UProfileView.addUserProfileView(document.getElementById("demoProfile"))
	// update the profile
	UProfileView.getUserProfile(piid);

	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});

//
// document.addEventListener("click", function(){
// 	var token = document.getElementById('htmlToken').value;
// 	var piid = document.getElementById('htmlPIid').value
// 	UProfileView.setToken(token);
// 	UProfileView.getUserProfile(piid);
// });
