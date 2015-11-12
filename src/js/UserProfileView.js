"use strict";

var view = requireText("../html/UserProfileView.html");
var UProfileService = require("o-profile-service").UserProfileService;
var EDIT = "Edit Bio"
var SUBMIT = "Submit"
var updateMsg = 'Update Profile Picture'
var loadingMsg = 'Loading Picture'
var unknownImage = "https://www.lariba.com/site/images/testimg/question.jpeg"
var loadingImage = "http://www.colorado.edu/Sociology/gimenez/graphics/gears.gif"

function ProfileView(url, token) {
	this.service = new UProfileService(url, token);
	this.profileData = {};
	return this;
}

ProfileView.prototype.addUserProfileView = function (element) {
	var container = document.createElement('div');
	container.id = 'o-profile-view';
	container.innerHTML = view;

	element.appendChild(container);
	var self = this;
	element.querySelector("#myEditButton").addEventListener("click", function () {
		self.setEditable();
		// this is #myEditButton
	});
	element.querySelector("#myCancelButton").addEventListener("click", function () {
		// reset userprofile
 		self.cancelEdit();
	});

	element.querySelector("#myAvatar").addEventListener("error", function () {
		// reset userprofile
		console.log('error loading avatar');
		element.querySelector("#myAvatar").src=unknownImage;
	});

	element.querySelector("#mySubmitButton").addEventListener("click", function () {
		// update data
		self.submitData();
	});
	element.querySelector("#myAvatarMsg").addEventListener("click", function () {
		element.querySelector("#avatarEditButton").click();
		// this sends the click from the nice message button to the real button
	});

	element.querySelector("#avatarEditButton").addEventListener("change", function () {
		self.addAvatar();
		// once the file is chosen this sets the avatar
	});
	self.unsetEditable();
}

ProfileView.prototype.updateCallback = function (err, text) {
	if (err != null) {
		console.error("There has been an error setting profile: " + err.responseText)
		return;
	}
}


ProfileView.prototype.getUserProfile = function (id) {
	this.service.getProfile(id, this.callback.bind(this));
}

ProfileView.prototype.updateUserProfile = function (id, data) {
	this.service.setProfile(id, data, this.callback.bind(this));
};

ProfileView.prototype.setToken = function (token) {
	this.service.token = token;
};

ProfileView.prototype.submitData = function () {
	console.log("submit")
	this.unsetEditable();
	this.profileData.aboutMini = document.getElementById('myBio').textContent;
	var self = this;
	this.service.setProfile(this.profileData.id, JSON.stringify(this.profileData), function (err, txt) {
		self.callback(err, txt);

	});
};

ProfileView.prototype.setEditable = function () {
	console.log("edit")
	var v = document.querySelectorAll(".edit");
	var i;
	for (i = 0; i < v.length; i++) {
		v[i].style.color = "blue";
		v[i].style.border = "solid 1px blue";
		v[i].contentEditable = "true";
	};
	document.querySelector(".o-profile__detail-cancel").style.visibility = "visible";
	document.querySelector(".o-profile__detail-submit").style.visibility = "visible";
	document.querySelector(".o-profile__detail-edit").style.visibility = "hidden";
};

ProfileView.prototype.unsetEditable = function () {
	var v = document.querySelectorAll(".edit");
	var i;
	for (i = 0; i < v.length; i++) {
		v[i].style.color = "black";
		v[i].style.border = "none";
		v[i].contentEditable = "false";
	};
	document.querySelector(".o-profile__detail-cancel").style.visibility = "hidden";
	document.querySelector(".o-profile__detail-submit").style.visibility = "hidden";
	document.querySelector(".o-profile__detail-edit").style.visibility = "visible";
};

ProfileView.prototype.cancelEdit = function () {
		this.unsetEditable();
		this.getUserProfile(this.profileData.id);
}






ProfileView.prototype.callback = function (err, text) {
	if (err != null) {
		console.error("There has been an error getting profile: " + err.responseText)
		return;
	}

	try {
		this.profileData = JSON.parse(text);
	}
	catch (e) {
		console.error(e, "profile json not well formed: " + text);
		this.profileData = {};
	}
	var pd = this.profileData;

	console.log(pd);
	document.getElementById('myUserName').textContent = pd.userName || "undefined"
	document.getElementById('myName').textContent = (pd.firstName + pd.lastName) || "Your name has not been added";
	document.getElementById('myEmail').textContent = pd.email || "Your email is undefined"
	document.getElementById('myEmail2').textContent = pd.email || "Your email is undefined"
	document.getElementById('myBio').textContent = pd.aboutMini || "Add a Bio"
	document.getElementById('myAvatar').src = pd.avatar || "Add an Avatar"

};

ProfileView.prototype.addAvatar = function () {
	var fileSelected = document.querySelector("#avatarEditButton").files;
	if (fileSelected.length > 0) {
		console.log("my files" + fileSelected[0].name);
		var self = this;
		document.getElementById('myAvatarMsg').textContent = loadingMsg;
		document.querySelector("#myAvatar").src=loadingImage;

		this.service.setAvatar(this.profileData.id, fileSelected[0], function (err, txt) {

			// the avatar upload process is asyncronous and we need to wait a bit before the image is availible to us
			setTimeout(function () {
				self.callback(err, txt);
				document.getElementById('myAvatarMsg').textContent = updateMsg;
			}, 2000);

		});

	}
};



module.exports = ProfileView;
