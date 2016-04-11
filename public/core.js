var WildGeekUsers=angular.module('WildGeekUsers',[]);

function usersController($scope,$http){
	$scope.formData={};
	$scope.view="users";

	// when landing on the page, get all users and show them
	$http.get('/api/users')
		.success(function(data) {
			$scope.users=data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	$scope.addComment=function(){
		if($scope.view.name===$scope.formData.commentUser){
			alert("You can't comment here.");
			$scope.formData={};
			return;
		}
		if($scope.formData.comment===undefined){
			alert("There is no comment.");
			$scope.formData={};
			return;
		}
		if($scope.formData.commentUser===undefined){
			alert("There is no user.");
			$scope.formData={};
			return;
		}
		if($scope.formData.commentPassword===undefined){
			alert("There is no password.");
			$scope.formData={};
			return;
		}
		var createUser=true;
		for(var i=0;i<$scope.users.length;i++){
			if($scope.users[i].name==$scope.formData.commentUser){
				if($scope.formData.commentPassword==$scope.users[i].password)
					createUser=false;
				else{
					alert("Wrong password.");
					$scope.formData={};
					return;
				}
			}
		}
		var canPublish=true;
		if(createUser){
			$scope.formData.name=$scope.formData.commentUser;
			$scope.formData.password=$scope.formData.commentPassword;
			$http.post('/api/users', $scope.formData)
				.success(function(data) {
					$scope.users = data;
				})
				.error(function(data) {
					console.log('Error: ' + data);
					canPublish=false;
				});
		}
		if(canPublish){
			$scope.view.comments.push({
				user: $scope.formData.commentUser,
				body: $scope.formData.comment,
			});
			$http.post('/api/comments', $scope.view)
				.success(function(data){
					$scope.users=data;
					$scope.goToUser(view.name);
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
					$scope.formData={};
				});
		}
		else{
			alert("Error en la base de datos");
			$scope.formData={};
		}
	};
	$scope.createUser=function(){
		if($scope.formData.name===undefined){
			alert("There is no name.");
			$scope.formData={};
			return;
		}
		if($scope.formData.password===undefined){
			alert("There is no password.");
			$scope.formData={};
			return;
		}
		for(var i=0;i<$scope.users.length;i++){
			if($scope.users[i].name==$scope.formData.name){
				alert("The user already exist, try with other name.");
				return;
			}
		}
		$http.post('/api/users', $scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.users = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
	$scope.deleteProject=function(index){
		for(var i=index;i<$scope.formData.editProjects.length-1;i++){
			var aux=$scope.formData.editProjects[i];
			$scope.formData.editProjects[i]=$scope.formData.editProjects[i+1];
			$scope.formData.editProjects[i+1]=aux;
		}
		$scope.formData.editProjects.pop();
	};
	$scope.deleteUser=function(name){
		if($scope.formData.deletePassword==$scope.view.password){
			$scope.formData={};
			$http.delete('/api/users/'+name)
			.success(function(data) {
				$scope.users = data;
				console.log(data);
				$scope.view="users";
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}
		else
			alert("Wrong password.");
	};
	$scope.goToEditMode=function(){
		if($scope.formData.deletePassword!=$scope.view.password){
			alert("Wrong password.");
			$scope.formData={};
			return;
		}
		$scope.formData.deletePassword="";
		$scope.formData.editAbout=$scope.view.about;
		$scope.formData.editProjects=[];
		for(var i=0;i<$scope.view.projects.length;i++){
			$scope.formData.editProjects.push({title: $scope.view.projects[i].title,body: $scope.view.projects[i].body})
		}
		$scope.view.edit=true;
	};
	$scope.goToUser=function(name){
		$scope.formData={};
		for(var i=0;i<$scope.users.length;i++){
			if($scope.users[i].name==name){
				$scope.view=$scope.users[i];
				if($scope.view.about===undefined||$scope.view.about===null)
					$scope.view.about="";
				if($scope.view.comments===undefined||$scope.view.comments===null)
					$scope.view.comments=[];
				if($scope.view.projects===undefined||$scope.view.projects===null)
					$scope.view.projects=[];
				$scope.view.edit=false;
				return;
			}
		}
	};
	$scope.newProject=function(){
		$scope.formData.editProjects.push({title: "",body: ""});
	};
	$scope.returntoUsers=function(){
		$scope.formData={};
		$scope.view="users";
	};
	$scope.save=function(){
		$scope.formData.name=$scope.view.name;
		$http.post('/api/user',$scope.formData)
			.success(function(data) {
				$scope.users=data;
				$scope.goToUser($scope.view.name);
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
				alert("Database error, try again.");
			});
	};
}