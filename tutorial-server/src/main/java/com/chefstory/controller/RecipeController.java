/**
 *
 */
package com.chefstory.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.ValidationException;

import com.chefstory.model.AddRecipe;
import com.chefstory.service.FileServiceUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.IngredientInRecipe;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.Unit;
import com.chefstory.model.GetConfigResponse;
import com.chefstory.repository.IngredientInRecipeRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.RecipeRepo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

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
	@Autowired
	private FileServiceUtils fileServiceUtils;

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
		List<Ingredient> ingredients = ingredientRepo.findAll();

		return new ResponseEntity<>(ingredients, HttpStatus.OK);
	}

	@PostMapping("/getRecipe")
	public ResponseEntity<Recipe> getRecipe(@RequestBody Recipe recipe) {
		return new ResponseEntity<>(recipeRepo.findById(recipe.getId()), HttpStatus.OK);
	}

	@PostMapping("/getIngredient")
	public ResponseEntity<Ingredient> getIngredient(@RequestBody Ingredient ingredient) {
		return new ResponseEntity<>(ingredientRepo.findById(ingredient.getId()), HttpStatus.OK);
	}

	@GetMapping("/getConfig")
	@Cacheable
	public ResponseEntity<GetConfigResponse> getConfig() {
		GetConfigResponse getConfigResponse = new GetConfigResponse();
		getConfigResponse.setUnitsDetailed(Unit.values());
		getConfigResponse.setUnits(Unit.values().values().stream()
				.flatMap(List::stream).collect(Collectors.toList()));
		return new ResponseEntity<>(getConfigResponse, HttpStatus.OK);
	}

	@PostMapping("/addRecipes")
	@Transactional
	public ResponseEntity addRecipes(@Valid @RequestBody List<AddRecipe> addRecipeList) {

			addRecipeList.forEach(addRecipe -> {
				if (CollectionUtils.isEmpty(addRecipe.getIngredientComp()))
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

	@PostMapping("/upload")
	public ResponseEntity uploadFile(@RequestParam("file") MultipartFile file) {
		fileServiceUtils.save(file);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

}
