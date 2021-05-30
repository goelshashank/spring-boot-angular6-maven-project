/**
 *
 */
package com.chefstory.controller;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.IngredientInRecipe;
import com.chefstory.entity.Recipe;
import com.chefstory.model.AddIngredientsToRecipe;
import com.chefstory.repository.IngredientInRecipeRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.RecipeRepo;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path="/chefstory",produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
@Validated
public class RecipeController {

	@Autowired
	private RecipeRepo recipeRepo;
	@Autowired
	private IngredientInRecipeRepo ingredientInRecipeRepo;
	@Autowired
	private IngredientRepo ingredientRepo;

	@GetMapping("/getAllRecipes")
	public ResponseEntity<List<Recipe>> getAllRecipes() {
		List<Recipe> recipeList = recipeRepo.findAll();
		return new ResponseEntity<>(recipeList, HttpStatus.OK);
	}

	@GetMapping("/getAllIngredients")
	public ResponseEntity<List<Ingredient>> getAllIngredients() {
		List<Ingredient> ingredients = ingredientRepo.findAll();
		return new ResponseEntity<>(ingredients, HttpStatus.OK);
	}

	@PostMapping("/addRecipes")
	public ResponseEntity addRecipes(@Valid @RequestBody List<Recipe> recipes) {
		recipeRepo.saveAll(recipes);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addIngredients")
	public ResponseEntity addIngredients(@Valid @RequestBody List<Ingredient> ingredients) {
		ingredientRepo.saveAll(ingredients);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addIngredientsToRecipe")
	@Transactional
	public ResponseEntity addIngredientToRecipe(@Valid @RequestBody AddIngredientsToRecipe addIngredientsToRecipe) {

		if (CollectionUtils.isEmpty(addIngredientsToRecipe.getIngredientCompIds())
				&& CollectionUtils.isEmpty(addIngredientsToRecipe.getRecipeCompIds()))
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

		List<IngredientInRecipe> ingredientInRecipes = new ArrayList<>();
		if (!CollectionUtils.isEmpty(addIngredientsToRecipe.getIngredientCompIds())) {
			addIngredientsToRecipe.getIngredientCompIds().parallelStream().forEach(t -> {
				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe();
				ingredientInRecipe.setRecipeId(addIngredientsToRecipe.getRecipeId());
				Ingredient ingredient = new Ingredient();
				ingredient.setId(t);
				ingredientInRecipe.setIngredientComp(ingredient);
				ingredientInRecipes.add(ingredientInRecipe);
			});
		}

		if (!CollectionUtils.isEmpty(addIngredientsToRecipe.getRecipeCompIds())) {
			addIngredientsToRecipe.getRecipeCompIds().parallelStream().forEach(t -> {
				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe();
				ingredientInRecipe.setRecipeId(addIngredientsToRecipe.getRecipeId());
				Recipe recipe = new Recipe();
				recipe.setId(t);
				ingredientInRecipe.setRecipeComp(recipe);
				ingredientInRecipes.add(ingredientInRecipe);
			});
		}
		ingredientInRecipeRepo.saveAll(ingredientInRecipes);

		return new ResponseEntity<>(HttpStatus.OK);

	}

}
