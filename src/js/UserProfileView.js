
const view = requireText("../html/UserProfileView.html");

const AvatarView =require('o-avatar').AvatarView;

const UProfileService = require("o-profile-service").UserProfileService;
const USERPROFILE_BIO_MAXCHARACTERS=256;
// ffffffff56686eaae4b0e03c2cdad8de  test user
// test user 2 ffffffff568d8db6e4b0fc33553eb238

function ProfileView(url, token, element) {
	this.service = new UProfileService(url, token);
	this.profileData = {};

	const container = document.createElement('div');
	container.innerHTML = view;

	element.appendChild(container);
	this.AView = new AvatarView(url, token,
		element.querySelector(".o-profile__detail-avatar"), "200px", true);

	let self = this;
	element.querySelector(".o-profile--label-edit-link").addEventListener("click", function () {
		self.setEditable();
		// this is #myEditButton
	});
	element.querySelector(".o-profile--bio-target-add").addEventListener("click", function () {
		self.setEditable();
		// this is #myEditButton
	});
	element.querySelector(".o-profile--cancel-edit").addEventListener("click", function () {
		// reset userprofile

		self.cancelEdit();
	});
	element.querySelector(".o-profile--submit-bio").addEventListener("click", function (event) {
		// update data
		event.preventDefault();
		self.submitData();
	});

		document.getElementById('o-profile--bio-edit-textarea').addEventListener("keyup", function (event) {
			// update data
			event.preventDefault();
			self.checkCharactersLeftInBio();

		});

	self.unsetEditable();

	return this;
}

ProfileView.prototype.getProfile = function () {
	return this.profileData;
};

ProfileView.prototype.setId = function (id) {
	this.service.getProfile(id, this.callback.bind(this));
	this.AView.setUser(id);
}

ProfileView.prototype.updateUserProfile = function (id, data) {
	this.service.setProfile(id, data, this.callback.bind(this));
		this.AView.setUser(id);
};

ProfileView.prototype.setToken = function (token) {
	this.service.token = token;
	this.AView.setToken(token);
};

ProfileView.prototype.submitData = function () {
	console.log("submit")
	if(this.checkCharactersLeftInBio() <0){
		console.log("trying to submit too many characters");
		return;
	}
	this.unsetEditable();
	this.profileData.aboutMini = 	document.getElementById('o-profile--bio-edit-textarea').value;
	console.log("setting profiledata "+ this.profileData.aboutMini);
	let self = this;
	this.service.setProfile(this.profileData.id, JSON.stringify(this.profileData), function (err, txt) {
		self.callback(err, txt);

	});
};

ProfileView.prototype.setEditable = function () {
	document.getElementById('o-profile--bio-edit-textarea').value = this.profileData.aboutMini || "Your Bio Here";
	document.querySelector(".o-profile--bio-edit-form").style.display = "block";
	document.querySelector(".o-profile--label-edit-link").style.display = "none";
	document.querySelector(".o-profile--bio-target").style.display = "none";
	document.querySelector('.o-profile--bio-target-add').style.display ="none" ;
	this.checkCharactersLeftInBio();

};

ProfileView.prototype.unsetEditable = function () {
	document.querySelector(".o-profile--bio-edit-form").style.display = "none";
	document.querySelector(".o-profile--label-edit-link").style.display = "block";
	document.querySelector(".o-profile--bio-target").style.display = "block";
};

ProfileView.prototype.cancelEdit = function () {
		this.unsetEditable();
		this.getUserProfile(this.profileData.id);
}

ProfileView.prototype.checkCharactersLeftInBio = function () {
	var count =document.getElementById('o-profile--bio-edit-textarea').value.length;

	if( count > USERPROFILE_BIO_MAXCHARACTERS){
		document.querySelector(".o-profile--submit-bio").style.display = "none";
		document.querySelector('.o-profile__detail-count').innerHTML ="Too Many Characters: "+ (count - USERPROFILE_BIO_MAXCHARACTERS);
	}else{
		document.querySelector(".o-profile--submit-bio").style.display = "block";
		document.querySelector('.o-profile__detail-count').innerHTML ="Characters Left: "+ (USERPROFILE_BIO_MAXCHARACTERS-count);
	}

	// return the characters left (neg means overrun)
	return (USERPROFILE_BIO_MAXCHARACTERS-count);
}

ProfileView.prototype.excludeField = function (fieldToExclude) {
	let classToExclude = ".o-profile__"+fieldToExclude;
	document.querySelector(classToExclude).style.display = "none";

}



ProfileView.prototype.callback = function (err, text) {
	if (err !== null) {
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
	let pd = this.profileData;

	if( ! pd.aboutMini || pd.aboutMini === "" ){
		// nothing here
		document.querySelector('.o-profile--bio-target-add').style.display ="block" ;
		document.querySelector(".o-profile--label-edit-link").style.display = "none";
		document.querySelector('.o-profile--bio-target').textContent = "";
	}else{
		// got something in the bio

		document.querySelector('.o-profile--bio-target-add').style.display ="none" ;
		// if there are links they need to be translated to anchors

		let inputText = pd.aboutMini;
		let replacedText;
		let replacePattern1;

	 //URLs starting with http://, https://, or ftp://
	 replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	 replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

	 document.querySelector('.o-profile--bio-target').innerHTML = replacedText;

	}

	console.log(pd);
	document.querySelector('.o-profile--user-name-target').textContent = pd.userName || "your username is currently undefined"
	document.querySelector('.o-profile--name-target').textContent = (pd.firstName +" "+ pd.lastName) || "Your name has not been added";
	//document.getElementById('myEmail').textContent = pd.email || "Your email is undefined"
	document.querySelector('.o-profile--email-target').textContent = pd.email || "Your email is undefined"

};



module.exports = ProfileView;
