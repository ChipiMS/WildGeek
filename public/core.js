var Educahorro=angular.module('Educahorro',[]);

function eduController($scope,$http){
	$scope.formData={};
	$scope.view="users";
	$scope.user=null;
	$scope.chat=function(){
		$("#Chat").css("display","block");
	};
	$scope.closeChat=function(){
		$("#Chat").css("display","none");
	};
	$scope.goToView=function(aux){
		$scope.view=aux;
		$scope.formData={};
	};
	$scope.login=function(){
		$http.get('/api/users',$scope.formData)
			.success(function(data) {
				$scope.user=data;
				if(data===null){
					$("#LoginContainer h6").css("display","block");	
					console.log("Sí");
				}
				else{
					console.log($scope.user);
				}
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
				$("#LoginContainer h6").css("display","block");
			});
		$scope.formData={};
	};
	$scope.newUser=function(){
		if($scope.formData.password!=$scope.formData.password2||($scope.formData.name==undefined||($scope.formData.password==undefined)||($scope.formData.email==undefined))){
			$("#NewUser h6").css("display","block");
			$scope.formData={};
			return;
		}
		$http.post('/api/users',$scope.formData)
			.success(function(data) {
				$scope.user=data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
				$("#NewUser h6").css("display","block");
			});
		$scope.formData={};
	};
	$scope.toggleSidebar=function(){
		$("main").toggleClass("FullScreen");
		$(".Sidebar").toggleClass("SidebarHidden");
	};
}