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

	let imgUrl ="http://epspqa.stg-openclass.com/grid-registrar/api/item/4fd4ea37-7c5b-43ce-a3f3-96875c761066/1/file/ffffffff568d8db6e4b0fc33553eb238.jpg";
//UProfileView.getProfile().avatar;

	var img = document.createElement("img");
	img.src = imgUrl;
  console.log("image source: "+ imgUrl);

	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));

});

//
// document.addEventListener("click", function(){
// 	var token = document.getElementById('htmlToken').value;
// 	var piid = document.getElementById('htmlPIid').value
// 	UProfileView.setToken(token);
// 	UProfileView.getUserProfile(piid);
// });
