/*global require*/
const ProfileView =require('../../main').UserProfileView;
const UProfileService = require("o-profile-service").UserProfileService;
let UProfileView;

document.addEventListener("DOMContentLoaded", function() {

	let token = document.getElementById('htmlToken').value;
  let piid = document.getElementById('htmlPIid').value
	let url = document.getElementById('htmlURL').value


	// url is the userprofile service url
	let service = new UProfileService(url, token);

	// make a new UserProfileView
	UProfileView = new ProfileView(
		service,
		document.getElementById("demoProfile"),
		"english");

	// exclude fields: username, name, email, bio
	UProfileView.excludeField("username");
	// UProfileView.excludeField("name");
	// UProfileView.excludeField("bio");
	// UProfileView.excludeField("email");

	// update the profile
	UProfileView.setId(piid);


	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));

});

//
// document.addEventListener("click", function(){
// 	var token = document.getElementById('htmlToken').value;
// 	var piid = document.getElementById('htmlPIid').value
// 	UProfileView.setToken(token);
// 	UProfileView.getUserProfile(piid);
// });
