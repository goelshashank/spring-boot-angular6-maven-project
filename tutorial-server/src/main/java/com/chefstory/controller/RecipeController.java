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

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.ValidationException;

import com.chefstory.entity.Supplier;
import com.chefstory.entity.SupplierForIngredient;
import com.chefstory.model.AddIngredient;
import com.chefstory.model.AddRecipe;
import com.chefstory.repository.SupplierForIngredientRepo;
import com.chefstory.repository.SupplierRepo;
import com.chefstory.service.FileServiceUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
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
	@Autowired
	private SupplierRepo supplierRepo;
	@Autowired
	private SupplierForIngredientRepo supplierForIngredientRepo;

	@PostConstruct
	public void init(){
		if(CollectionUtils.isEmpty(supplierRepo.findByTitle("default")))
			supplierRepo.save(new Supplier().setTitle("default"));
	}

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

		List<Recipe> recipes=new ArrayList<>();
		recipes.add(new Recipe().setTitle("1"));
		//addSuppliers(Arrays.asList(new Supplier().setTitle("a")));
		Ingredient ingredient=ingredientRepo.findByTitle("fgds").get(0);
		Ingredient ing1=new Ingredient();
		ing1.setId(ingredient.getId());
		recipes.get(0).setIngredientInRecipe(Arrays.asList(new IngredientInRecipe()
				.setRecipe(recipes.get(0)).setIngredientComp(ing1)));
		recipeRepo.saveAll(recipes);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addIngredients")
	public ResponseEntity addIngredients(@Valid @RequestBody List<AddIngredient> addIngredients) {

		addIngredients.forEach(t->{
			Ingredient ingredient=t.getIngredient();
			Supplier supplier=CollectionUtils.isEmpty(t.getSupplierComps())?supplierRepo.findByTitle("default").get(0):null;
			ingredient.setSupplierForIngredients(Arrays.asList(new SupplierForIngredient().setIngredient(ingredient).setSupplierComp(supplier)));
			ingredientRepo.save(ingredient);
		});

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addSuppliers")
	public ResponseEntity addSuppliers(@Valid @RequestBody List<Supplier> suppliers) {
		supplierRepo.saveAll(suppliers);
		return new ResponseEntity<>(HttpStatus.OK);
	}


	public ResponseEntity addIngredientToRecipe(AddRecipe addRecipe) {

		List<IngredientInRecipe> ingredientInRecipes = new ArrayList<>();
		if (!CollectionUtils.isEmpty(addRecipe.getIngredientComp())) {
			addRecipe.getIngredientComp().parallelStream().forEach(t -> {
				if(t==null)
					return;
				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe();
				ingredientInRecipe.setRecipe(addRecipe.getRecipe());
				Ingredient ingredient = new Ingredient();
				ingredient.setId(t.getId());
				ingredientInRecipe.setIngredientComp(ingredient);
				ingredientInRecipe.setQuantityUnit(t.getQuantityUnit());
				ingredientInRecipes.add(ingredientInRecipe);
				addRecipe.getRecipe().setIngredientInRecipe(ingredientInRecipes);
			});
		}

		if (!CollectionUtils.isEmpty(addRecipe.getRecipeComp())) {
			addRecipe.getRecipeComp().parallelStream().forEach(t -> {
				if(t==null)
					return;

				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe();
				ingredientInRecipe.setRecipe(addRecipe.getRecipe());
				Recipe recipe = new Recipe();
				recipe.setId(t.getId());
				ingredientInRecipe.setRecipeComp(recipe);
				ingredientInRecipe.setQuantityUnit(t.getQuantityUnit());
				ingredientInRecipes.add(ingredientInRecipe);
				addRecipe.getRecipe().setIngredientInRecipe(ingredientInRecipes);
			});
		}
 		recipeRepo.save(addRecipe.getRecipe());

		return new ResponseEntity<>(HttpStatus.OK);

	}

	@PostMapping("/upload")
	public ResponseEntity uploadFile(@RequestParam("file") MultipartFile file) {
		fileServiceUtils.save(file);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

}
