package com.chefstory.service;

import com.chefstory.entity.Brand;
import com.chefstory.entity.Category;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.Supplier;
import com.chefstory.entity.linkent.BrandForIngredient;
import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.SupplierForIngredient;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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


	public List<CategoryFor> addCategories(AddRecipe t) {
		Recipe recipe = t.getRecipe();
		List<CategoryFor> categoryFors;
		if (CollectionUtils.isEmpty(t.getRecipe().getCategoriesForRecipe())) {
			return null;
		} else {
			categoryFors = t.getRecipe().getCategoriesForRecipe().stream().map(u -> {
				categoryRepo.save(u.getCategory());
				log.info("category added - {} for recipe- {}", u.getCategory().getTitle(), recipe.getTitle());
				return new CategoryFor().setRecipe(recipe).setCategory(u.getCategory());
			}).collect(Collectors.toList());
		}
		return categoryFors;
	}

	public List<CategoryFor> addCategories(AddIngredient t) {
		Ingredient ingredient = t.getIngredient();
		List<CategoryFor> categoryFors;
		if (CollectionUtils.isEmpty(t.getIngredient().getCategoriesForIngredient())) {
			return new ArrayList<>();
		} else {
			categoryFors = t.getIngredient().getCategoriesForIngredient().stream().map(u -> {
				List<Category> categories = categoryRepo.findByTitle(u.getCategory().getTitle());
				if (CollectionUtils.isEmpty(categories)) {
					categoryRepo.save(u.getCategory());
				} else {
					u.setCategory(categories.get(0));
				}
				log.info("category added - {} for ingredient- {}", u.getCategory().getTitle(), ingredient.getTitle());
				CategoryFor categoryFor = new CategoryFor().setIngredient(ingredient).setCategory(u.getCategory());
				categoryFor.setId(u.getId());
				return categoryFor;
			}).collect(Collectors.toList());
		}
		return categoryFors;
	}

	public List<BrandForIngredient> addBrands(AddIngredient t) {
		Ingredient ingredient = t.getIngredient();
		List<BrandForIngredient> brandForIngredients;
		if (CollectionUtils.isEmpty(t.getIngredient().getBrandForIngredients())) {
			return new ArrayList<>();
		} else {
			brandForIngredients = t.getIngredient().getBrandForIngredients().stream().map(u -> {
				List<Brand> brands = brandRepo.findByTitle(u.getBrand().getTitle());
				if (CollectionUtils.isEmpty(brands)) {
					brandRepo.save(u.getBrand());
				} else {
					u.setBrand(brands.get(0));
				}
				log.info("brand added - {} for ingredient- {}", u.getBrand().getTitle(), ingredient.getTitle());
				BrandForIngredient brandForIngredient = new BrandForIngredient().setIngredient(ingredient).setBrand(u.getBrand());
				brandForIngredient.setId(u.getId());
				return brandForIngredient;
			}).collect(Collectors.toList());
		}
		return brandForIngredients;
	}

	public List<SupplierForIngredient> addSupplier(AddIngredient t) {
		Ingredient ingredient = t.getIngredient();
		List<SupplierForIngredient> supplierForIngredients;
		if (CollectionUtils.isEmpty(t.getIngredient().getSupplierForIngredients())) {
			return new ArrayList<>();
		} else {
			supplierForIngredients = t.getIngredient().getSupplierForIngredients().stream().map(u -> {
				List<Supplier> suppliers = supplierRepo.findByTitle(u.getSupplier().getTitle());
				if (CollectionUtils.isEmpty(suppliers)) {
					supplierRepo.save(u.getSupplier());
				} else {
					u.setSupplier(suppliers.get(0));
				}
				log.info("supplier added - {} for ingredient- {}", u.getSupplier().getTitle(), ingredient.getTitle());
				SupplierForIngredient supplierForIngredient = new SupplierForIngredient().setIngredient(ingredient)
						.setSupplier(u.getSupplier());
				supplierForIngredient.setId(u.getId());
				return supplierForIngredient;

			}).collect(Collectors.toList());

		}
		return supplierForIngredients;
	}

	public void markIngredientInActive(Ingredient ingredient) {
		if (CollectionUtils.isEmpty(ingredientRepo.findByTitle(ingredient.getTitle())))
			return;

		Ingredient t = new Ingredient();
		t.setId(ingredient.getId());
		t.setTitle(ingredient.getTitle());
		t.setStatus(Status.INACTIVE);
		ingredientRepo.save(t);
	}

	public void markRecipeInActive(Recipe recipe) {
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
