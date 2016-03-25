# o-profile-view

The user profile view lets one see data from the user profile service.  
Currently the data available are:
  user name
  first and last name
  email
  bio
  and avatar


## Instantiation and options:
  UProfileView = new ProfileView(
    service,    // ( This is the user profile service with calls  call backs for userprofile data.
                // the o-Userprofile-Service is a reference implementation.  )
    document.getElementById("demoProfile"),// (This is the element of the document that the user profile view  will be placed upon)
    "english");  // one of the supported languages in the translation directory's translation file.  The default is english.

## removing fields
  fields can be excluded if one doesn't want to show all elements of the user profileTranslations

  UProfileView.excludeField("username");

##Language support
  In the translations folder there is a profileTranslations.json file that contains key-value pairs from tag to translation.  The english translations can be used as a guide to create other translations in other languages.

## setting the Pi Id
    Once an user profile view component is created the pi id is set to link the user profile view to a specific account.

    UProfileView.setId(piid);

## editing the data
  At the current time the decision has been made to not edit the user name, email, or first and last name as this is the pervue of the pi service and their components.

  The bio is editable and the number of characters in the bio is at this point limited to 256
  The avatar is also editable (see o-avatar component for details)
