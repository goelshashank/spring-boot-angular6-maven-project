package com.chefstory.service;

import com.chefstory.entity.Brand;
import com.chefstory.entity.Category;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.Supplier;
import com.chefstory.entity.linkent.BrandForIngredient;
import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.IngredientInRecipe;
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

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service @Slf4j public class KitchenService {

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

	@PostConstruct public void init() {
	}

	public void addIngredient(List<AddIngredient> addIngredients) {
		ingredientRepo.saveAll(addIngredients.stream().map(t -> {
			t.getIngredient().setCategoriesForIngredient(addCategories(t)).setBrandForIngredients(addBrands(t))
					.setSupplierForIngredients(addSupplier(t));
			return t.getIngredient();
		}).collect(Collectors.toList()));
	}

	public void updateIngredient(List<AddIngredient> updateIngredients) {
		updateIngredients.forEach(u -> {

			Ingredient ingredient = u.getIngredient();

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
					addCategories(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));
			ingredient.setBrandForIngredients(addBrands(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));
			ingredient.setSupplierForIngredients(addSupplier(u).stream().filter(k -> k.getId() == null).collect(Collectors.toList()));

			ingredientRepo.save(ingredient);
		});
	}

	public void removeIngredient(List<AddIngredient> addIngredients) {
		ingredientRepo.saveAll(addIngredients.stream().map(t -> {
			t.getIngredient().setStatus(Status.INACTIVE);
			return t.getIngredient();
		}).collect(Collectors.toList()));
	}

	public void addRecipe(List<AddRecipe> addRecipeList) {
		List<Recipe> recipes = new ArrayList<>();
		addRecipeList.forEach(t -> {
			if (CollectionUtils.isEmpty(t.getRecipe().getIngredientInRecipe()))
				return;

			Recipe recipe = t.getRecipe();
			//  updateIngredient(t.getRecipe().getIngredientInRecipe().stream().map
			//  (i -> new AddIngredient().setIngredient(i.getIngredient())).collect(Collectors.toList()));

			List<IngredientInRecipe> ingredientInRecipes = t.getRecipe().getIngredientInRecipe().stream().map(u -> {

				IngredientInRecipe ingredientInRecipe = new IngredientInRecipe().setRecipe(recipe).setIngredient(u.getIngredient())
						.setCategory(u.getCategory()).setSupplier(u.getSupplier()).setBrand(u.getBrand());
				return ingredientInRecipe;
			}).collect(Collectors.toList());
			recipe.setIngredientInRecipe(ingredientInRecipes).setCategoriesForRecipe(addCategories(t));

			recipes.add(recipe);
		});
		recipeRepo.saveAll(recipes);
	}

	public void updateRecipe(List<AddRecipe> updateRecipes) {
		updateRecipes.forEach(u -> {

			Recipe recipe = u.getRecipe();

			List<Long> newIngredientInRecipeList = recipe.getIngredientInRecipe().stream().map(t -> t.getId()).filter(t -> t != null)
					.collect(Collectors.toList());

			List<Long> newCategoryFors = recipe.getCategoriesForRecipe().stream().map(t -> t.getId()).filter(t -> t != null)
					.collect(Collectors.toList());

			Recipe oldRecipe = recipeRepo.findById(recipe.getId());
			oldRecipe.getIngredientInRecipe().forEach(t -> {
				if (!newIngredientInRecipeList.contains(t.getId())) {
					ingredientInRecipeRepo.delete(t);
				}
			});
			oldRecipe.getCategoriesForRecipe().forEach(t -> {
				if (!newCategoryFors.contains(t.getId())) {
					categoryForRepo.delete(t);
				}
			});

			addRecipe(Collections.singletonList(new AddRecipe().setRecipe(recipe)));
		});
	}

	public void removeRecipe(List<AddRecipe> addRecipeList) {
		recipeRepo.saveAll(addRecipeList.stream().map(t -> {
			t.getRecipe().setStatus(Status.INACTIVE);
			return t.getRecipe();
		}).collect(Collectors.toList()));
	}

	private List<CategoryFor> addCategories(AddRecipe t) {
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

	private List<CategoryFor> addCategories(AddIngredient t) {
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

	private List<BrandForIngredient> addBrands(AddIngredient t) {
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

	private List<SupplierForIngredient> addSupplier(AddIngredient t) {
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

}

