Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

	//file:/client/init.js
	Meteor.startup(function() {
		Uploader.uploadUrl = Meteor.absoluteUrl("upload");
		// Cordova needs absolute URL
	});

	// This code only runs on the client
	Template.body.helpers({
		tasks : function() {
			// Show newest tasks at the top

			//

			/*
			 var alltask = Tasks.find({}, {
			 sort : {
			 createdAt : -1
			 }
			 });

			 return alltask;*/

			Meteor.subscribe('allTasks')

			var alltask = Tasks.find({}, {
				sort : {
					createdAt : -1
				}
			});
			console.log("alltaskalltaskalltask", JSON.stringify(alltask))
			return alltask;
			//Meteor.call('getTasks')
		}
	});

	Template.body.events({

		"submit .new-task" : function(event) {
			// Prevent default browser form submit
			event.preventDefault();

			// Get value from form element
			var text = event.target.text.value;

			// Insert a task into the collection

			Meteor.call('newPost', {
				text : text,
				createdAt : new Date()
			});

			/*
			Tasks.insert({
			text : text,
			createdAt : new Date() // current time
			});*/

			// Clear form
			event.target.text.value = "";
		}
	});

	Template.task.events({
		"click .toggle-checked" : function() {
			// Set the checked property to the opposite of its current value
			Tasks.update(this._id, {
				$set : {
					checked : !this.checked
				}
			});
		},
		"click .delete" : function() {
			Tasks.remove(this._id);
		}
	});

}

if (Meteor.isServer) {
	Meteor.startup(function() {
		// code to run on server at startup

		UploadServer.init({
			tmpDir : process.env.PWD + '/.uploads/tmp',
			uploadDir : process.env.PWD + '/.uploads/',
			checkCreateDirectories : true //create the directories for you
		})
	});

	Meteor.methods({

		newPost : function(post) {

			//Tasks.remove({});

			Tasks.insert(post, function(error, results) {

				if (error) {
					console.log(error)
				}

				console.log("resultsresults", results)
				// Router.go('listPage', { _id: results });
			});
			//Tasks.insert(post);
		},
		getTasks : function() {

			var alltask = Tasks.find({}, {
				sort : {
					createdAt : -1
				}
			}).fetch();

			console.log("allllllllllllllllllllllltsassssssssssssskkkkkkkkkkkkkk", alltask)
			return alltask;
		}
	})

	//server code
	Meteor.publish('allTasks', function() {
		return Tasks.find({}, {
			sort : {
				createdAt : -1
			}
		});
	});

	/*
	 Tasks.allow({
	 find : function(doc) {
	 return true;
	 }
	 })*/

	Accounts.onCreateUser(function(options, user) {
		console.log("userrrrrrrrrrrrrrrrrr", user)

		return user;
	})
}
