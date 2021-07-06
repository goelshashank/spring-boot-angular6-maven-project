/**
 *
 */
package com.chefstory.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.ValidationException;

import com.chefstory.model.AddRecipe;
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
import com.chefstory.entity.Unit;
import com.chefstory.model.GetConfigResponse;
import com.chefstory.repository.IngredientInRecipeRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.RecipeRepo;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path = "/chefstory", produces = MediaType.APPLICATION_JSON_VALUE)
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
		List<Recipe> recipes = recipeRepo.findAll().stream().map(t -> {
			Recipe recp = new Recipe();
			recp.setId(t.getId());
			recp.setTitle(t.getTitle());
			return recp;
		}).collect(Collectors.toList());
		return new ResponseEntity<>(recipes, HttpStatus.OK);
	}

	@GetMapping("/getAllIngredients")
	public ResponseEntity<List<Ingredient>> getAllIngredients() {
		List<Ingredient> ingredients = ingredientRepo.findAll().stream().map(t -> {
			Ingredient ing = new Ingredient();
			ing.setId(t.getId());
			ing.setTitle(t.getTitle());
			return ing;
		}).collect(Collectors.toList());

		return new ResponseEntity<>(ingredients, HttpStatus.OK);
	}

	@GetMapping("/getRecipe")
	public ResponseEntity<Recipe> getRecipe(@RequestBody Recipe recipe) {
		return new ResponseEntity<>(recipeRepo.getOne(recipe.getId().intValue()), HttpStatus.OK);
	}

	@GetMapping("/getIngredient")
	public ResponseEntity<Ingredient> getIngredient(@RequestBody Ingredient ingredient) {
		return new ResponseEntity<>(ingredientRepo.getOne(ingredient.getId().intValue()), HttpStatus.OK);
	}

	@GetMapping("/getConfig")
	public ResponseEntity<GetConfigResponse> getConfig() {
		GetConfigResponse getConfigResponse = new GetConfigResponse();
		getConfigResponse.setUnits(new ArrayList(Arrays.asList(Unit.values())));
		return new ResponseEntity<>(getConfigResponse, HttpStatus.OK);
	}

	@PostMapping("/addRecipes")
	@Transactional
	public ResponseEntity addRecipes(@Valid @RequestBody List<AddRecipe> addRecipeList) {

			addRecipeList.forEach(addRecipe -> {
				if (CollectionUtils.isEmpty(addRecipe.getIngredientComp()) && CollectionUtils.isEmpty(addRecipe.getRecipeComp()))
					throw new ValidationException();

				recipeRepo.save(addRecipe.getRecipe());
				addIngredientToRecipe(addRecipe);
			});


		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addIngredients")
	public ResponseEntity addIngredients(@Valid @RequestBody List<Ingredient> ingredients) {
		ingredientRepo.saveAll(ingredients);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/existIngredient")
	public ResponseEntity<Boolean> existIngredient(@Valid @RequestBody Ingredient ingredient) {
		Ingredient ing = ingredientRepo.findByTitle(ingredient.getTitle());
		if (ing != null)
			return new ResponseEntity<>(true, HttpStatus.OK);

		return new ResponseEntity<>(false, HttpStatus.OK);
	}


	public ResponseEntity addIngredientToRecipe(AddRecipe addRecipe) {

		List<IngredientInRecipe> ingredientInRecipes = new ArrayList<>();
		if (!CollectionUtils.isEmpty(addRecipe.getIngredientComp())) {
			addRecipe.getIngredientComp().parallelStream().forEach(t -> {
				if(t==null)
					return;
				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe();
				ingredientInRecipe.setRecipeId(addRecipe.getRecipe().getId());
				Ingredient ingredient = new Ingredient();
				ingredient.setId(t.getId());
				ingredientInRecipe.setIngredientComp(ingredient);
				ingredientInRecipe.setQuantityUnit(t.getQuantityUnit());
				ingredientInRecipes.add(ingredientInRecipe);
			});
		}

		if (!CollectionUtils.isEmpty(addRecipe.getRecipeComp())) {
			addRecipe.getRecipeComp().parallelStream().forEach(t -> {
				if(t==null)
					return;

				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe();
				ingredientInRecipe.setRecipeId(addRecipe.getRecipe().getId());
				Recipe recipe = new Recipe();
				recipe.setId(t.getId());
				ingredientInRecipe.setRecipeComp(recipe);
				ingredientInRecipe.setQuantityUnit(t.getQuantityUnit());
				ingredientInRecipes.add(ingredientInRecipe);
			});
		}
		ingredientInRecipeRepo.saveAll(ingredientInRecipes);

		return new ResponseEntity<>(HttpStatus.OK);

	}

}
