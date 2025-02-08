import * as firebase from 'firebase';

let config = {
    apiKey: "AIzaSyAyvE_mLR_PEBCmlOs4Se-g1NLahX1htLE", 
    databaseURL: "gs://mapilocations.appspot.com",
    projectId: "mapilocations",
    storageBucket: "mapilocations.appspot.com",
    messagingSenderId: "AAAA-U9pcl8:APA91bHUxIUGXEyvAYB3xtLMhxdc8m1wBoPJ0jpBoUyrvGrgWdBmI4TrzHS6mPaWV1d_itmT4dYuOVI52PBxZn28igAnP-Ccl4ouqYxjOp3tjoATHVxDSaODxkCBKS6et-WFedwpo64-"
};
firebase.initializeApp(config);

export default firebase;