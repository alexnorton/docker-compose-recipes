angular
  .module('admin', ['ngResource', 'ui.bootstrap', 'schemaForm'])
  .factory('Recipe', function($resource) {
    return $resource('/api/recipes/:id', { "id": "@_id" });
  })
  .controller('adminController', function($scope, Recipe, $uibModal) {
    var loadRecipes = function() {
      $scope.recipes = Recipe.query();
    }

    loadRecipes();

    $scope.openForm = function(recipe) {
      var modal = $uibModal.open({
        templateUrl: 'templates/form.html',
        controller: 'formController',
        resolve: {
          recipe: function() {
            return angular.copy(recipe) || new Recipe();
          }
        }
      });

      modal.result.then(function() {
        loadRecipes();
      });
    };

    $scope.deleteRecipe = function(recipe) {
      recipe.$delete();
      loadRecipes();
    }
  })
  .controller('formController', function($scope, Recipe, $uibModalInstance, recipe) {
    $scope.schema = {
      "title": "Alex's Recipes recipe schema",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Title"
        },
        "ingredients": {
          "type": "array",
          "title": "Ingredients list",
          "items": {
            "type": "string",
            "title": "Ingredient",
            "required": true
          },
          "minItems": 1
        },
        "instructions": {
          "type": "array",
          "title": "Instructions list",
          "items": {
            "type": "string",
            "title": "Instruction",
            "required": true
          },
          "minItems": 1
        }
      },
      "required": ["title", "ingredients", "instructions"]
    };

    $scope.form = [
      '*',
      {
        type: 'actions',
        items: [
          { type: 'submit', style: 'btn-raised btn-success', title: 'Save' }
        ]
      }
    ];

    $scope.recipe = recipe;

    $scope.save = function(form) {
      $scope.$broadcast('schemaFormValidate');

      if(form.$valid) {
        $scope.recipe.$save();
        $uibModalInstance.close();
      }
    };
  });
