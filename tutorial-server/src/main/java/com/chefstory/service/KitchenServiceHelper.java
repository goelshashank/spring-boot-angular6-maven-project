package com.chefstory.service;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.pojo.Status;
import com.chefstory.model.AddIngredient;
import com.chefstory.model.AddRecipe;
import com.chefstory.repository.BrandRepo;
import com.chefstory.repository.CategoryRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.RecipeRepo;
import com.chefstory.repository.SupplierRepo;
import com.chefstory.repository.linkrepo.BrandForIngredientRepo;
import com.chefstory.repository.linkrepo.CategoryForRepo;
import com.chefstory.repository.linkrepo.IngredientInRecipeRepo;
import com.chefstory.repository.linkrepo.SupplierForIngredientRepo;
import com.chefstory.utils.FileUtils;
import com.chefstory.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Arrays;
import java.util.Collections;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 18/09/22
 */
@Service @Slf4j public class KitchenServiceHelper {


	@Autowired BrandForIngredientRepo brandForIngredientRepo;
	@Autowired BrandRepo brandRepo;
	@Autowired CategoryRepo categoryRepo;
	@Autowired CategoryForRepo categoryForRepo;
	@Autowired private RecipeRepo recipeRepo;
	@Autowired private IngredientInRecipeRepo ingredientInRecipeRepo;
	@Autowired private IngredientRepo ingredientRepo;
	@Autowired private FileUtils fileUtils;
	@Autowired private SupplierRepo supplierRepo;
	@Autowired private SupplierForIngredientRepo supplierForIngredientRepo;
	@Autowired private Utils utils;

	private void markIngredientInActive(Ingredient ingredient) {
		if (CollectionUtils.isEmpty(ingredientRepo.findByTitle(ingredient.getTitle())))
			return;

		Ingredient t = new Ingredient();
		t.setId(ingredient.getId());
		t.setTitle(ingredient.getTitle());
		t.setStatus(Status.INACTIVE);
		ingredientRepo.save(t);
	}

	private void markRecipeInActive(Recipe recipe) {
		if (CollectionUtils.isEmpty(recipeRepo.findByTitle(recipe.getTitle())))
			return;

		Recipe t = new Recipe();
		t.setId(recipe.getId());
		t.setTitle(recipe.getTitle());
		t.setStatus(Status.INACTIVE);
		recipeRepo.save(t);
	}


/*
	private void createNewIngOnUpdate(Ingredient ingredient) {
		markIngredientInActive(ingredient);

		ingredient.setId(null);
		ingredient.setStatus(Status.ACTIVE);
		if (!CollectionUtils.isEmpty(ingredient.getBrandForIngredients()))
			ingredient.getBrandForIngredients().forEach(t -> t.setId(null));
		if (!CollectionUtils.isEmpty(ingredient.getSupplierForIngredients()))
			ingredient.getSupplierForIngredients().forEach(t -> t.setId(null));
		if (!CollectionUtils.isEmpty(ingredient.getCategoriesForIngredient()))
			ingredient.getCategoriesForIngredient().forEach(t -> t.setId(null));

		addIngredient(Collections.singletonList(new AddIngredient().setIngredient(ingredient)));
	}
*/


/*	private void createNewRECIPEOnUpdate(Recipe recipe) {
		markRecipeInActive(recipe);

		recipe.setId(null);
		recipe.setStatus(Status.ACTIVE);
		if (!CollectionUtils.isEmpty(recipe.getIngredientInRecipe()))
			recipe.getIngredientInRecipe().forEach(t -> t.setId(null));
		if (!CollectionUtils.isEmpty(recipe.getCategoriesForRecipe()))
			recipe.getCategoriesForRecipe().forEach(t -> t.setId(null));

		addRecipe(Arrays.asList(new AddRecipe().setRecipe(recipe)));
	}*/

}
