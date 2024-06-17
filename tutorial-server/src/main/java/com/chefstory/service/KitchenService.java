package com.chefstory.service;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.linkent.IngredientInRecipe;
import com.chefstory.entity.pojo.Status;
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

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service @Slf4j public class KitchenService {

	@Autowired public BrandForIngredientRepo brandForIngredientRepo;
	@Autowired public BrandRepo brandRepo;
	@Autowired public CategoryRepo categoryRepo;
	@Autowired public CategoryForRepo categoryForRepo;
	@Autowired  public RecipeRepo recipeRepo;
	@Autowired public  IngredientInRecipeRepo ingredientInRecipeRepo;
	@Autowired  public IngredientRepo ingredientRepo;
	@Autowired public  FileUtils fileUtils;
	@Autowired public  SupplierRepo supplierRepo;
	@Autowired public  SupplierForIngredientRepo supplierForIngredientRepo;
	@Autowired  public Utils utils;
	@Autowired  public KitchenServiceHelper helper;

	@PostConstruct public void init() {
	}

	public void addIngredient(List<Ingredient> addIngredients) {
		ingredientRepo.saveAll(addIngredients.stream().map(t -> {
			t.setCategoriesForIngredient(helper.addCategories(t)).setBrandForIngredients(helper.addBrands(t))
					.setSupplierForIngredients(helper.addSupplier(t));
			return t;
		}).collect(Collectors.toList()));
	}

	public void updateIngredient(List<Ingredient> updateIngredients) {
		updateIngredients.forEach(u -> {

			Ingredient ingredient = u;

			Ingredient oldIng = ingredientRepo.findById(ingredient.getId());

			utils.subtract(oldIng.getSupplierIds(), ingredient.getSupplierIds()).forEach(t -> {
				supplierForIngredientRepo.deleteById((Long) t);
			});
			utils.subtract(oldIng.getBrandIds(), ingredient.getBrandIds()).forEach(t -> {
				brandForIngredientRepo.deleteById((Long) t);
			});
			utils.subtract(oldIng.getCategoryForIds(), ingredient.getCategoryForIds()).forEach(t -> {
				categoryForRepo.deleteById((Long) t);
			});

			ingredient.setCategoriesForIngredient(
					helper.addCategories(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));
			ingredient.setBrandForIngredients(helper.addBrands(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));
			ingredient.setSupplierForIngredients(helper.addSupplier(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));

			ingredientRepo.save(ingredient);
		});
	}

	public void removeIngredient(List<Ingredient> addIngredients) {
		ingredientRepo.saveAll(addIngredients.stream().map(t -> {
			t.setStatus(Status.INACTIVE);
			return t;
		}).collect(Collectors.toList()));
	}

	public void addRecipe(List<Recipe> addRecipeList) {
		List<Recipe> recipes = new ArrayList<>();
		addRecipeList.forEach(t -> {
			if (CollectionUtils.isEmpty(t.getIngredientInRecipe()))
				return;

			Recipe recipe = t;
			 // updateIngredient(t.getIngredientInRecipe().stream().map
			 // (i -> new AddIngredient().setIngredient(i))
			// .collect(Collectors.toList()));

			List<IngredientInRecipe> ingredientInRecipes =
					recipe.getIngredientInRecipe().stream().map(u -> {

				u.setRecipe(recipe).setIngredient(u.getIngredient())
						.setCategory(u.getCategory()).setSupplier(u.getSupplier()).setBrand(u.getBrand());
				return u;
			}).collect(Collectors.toList());
			recipe.setIngredientInRecipe(ingredientInRecipes).setCategoriesForRecipe(helper.addCategories(t));

			recipes.add(recipe);
		});
		recipeRepo.saveAll(recipes);
	}

	public void updateRecipe(List<Recipe> updateRecipes) {
		updateRecipes.forEach(u -> {

			Recipe recipe = u;

			Recipe oldRecipe = recipeRepo.findById(recipe.getId());

			utils.subtract(oldRecipe.getIngredientIds(), recipe.getIngredientIds()).forEach(t -> {
				ingredientInRecipeRepo.deleteById((Long) t);
			});
			utils.subtract(oldRecipe.getCategoryForIds(), recipe.getCategoryForIds()).forEach(t -> {
				categoryForRepo.deleteById((Long) t);
			});

			recipe.setCategoriesForRecipe(
					helper.addCategories(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));
			recipe.setIngredientInRecipe(recipe.getIngredientInRecipe().stream().filter(k -> k.getId() == null).collect(Collectors.toList()));

			recipeRepo.save(recipe);

		});
	}

	public void removeRecipe(List<Recipe> addRecipeList) {
		recipeRepo.saveAll(addRecipeList.stream().map(t -> {
			t.setStatus(Status.INACTIVE);
			return t;
		}).collect(Collectors.toList()));
	}


}

