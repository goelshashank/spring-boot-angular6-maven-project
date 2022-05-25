package com.chefstory.service;

import com.chefstory.entity.*;
import com.chefstory.entity.linkent.BrandForIngredient;
import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.IngredientInRecipe;
import com.chefstory.entity.linkent.SupplierForIngredient;
import com.chefstory.entity.pojo.Status;
import com.chefstory.model.AddIngredient;
import com.chefstory.model.AddRecipe;
import com.chefstory.repository.*;
import com.chefstory.repository.linkrepo.BrandForIngredientRepo;
import com.chefstory.repository.linkrepo.IngredientInRecipeRepo;
import com.chefstory.repository.linkrepo.SupplierForIngredientRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RecipeService {

    @Autowired
    BrandForIngredientRepo brandForIngredientRepo;
    @Autowired
    BrandRepo brandRepo;
    @Autowired
    CategoryRepo categoryRepo;
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
    public void init() {
    }

    public void updateIngredient(List<AddIngredient> addIngredients) {
        ingredientRepo.saveAll(  addIngredients.stream().map(t -> {
           t.getIngredient().setCategoriesForIngredient(addCategories(t))
                    .setBrandForIngredients(addBrands(t))
                    .setSupplierForIngredients(addSupplier(t));
            return t.getIngredient();
        }).collect(Collectors.toList()));
    }

    public void removeIngredient(List<AddIngredient> addIngredients) {
      ingredientRepo.saveAll(addIngredients.stream().map(t -> {
            t.getIngredient().setStatus(Status.INACTIVE);
            return t.getIngredient();
        }).collect(Collectors.toList()));
    }

    public void updateRecipe(List<AddRecipe> addRecipeList) {
        List<Recipe> recipes = new ArrayList<>();
        addRecipeList.forEach(t -> {
            if (CollectionUtils.isEmpty(t.getAddIngredients()))
                return;

            Recipe recipe = t.getRecipe();

            updateIngredient(t.getAddIngredients());

            List<IngredientInRecipe> ingredientInRecipes = t.getAddIngredients().stream().map(u -> {

                Supplier supplier = CollectionUtils.isEmpty(u.getAddSuppliers()) ? null : u.getAddSuppliers().get(0).getSupplier();
                Brand brand = CollectionUtils.isEmpty(u.getAddBrands()) ? null : u.getAddBrands().get(0).getBrand();
                Category category = CollectionUtils.isEmpty(u.getAddCategories()) ? null : u.getAddCategories().get(0).getCategory();

                IngredientInRecipe ingredientInRecipe = new IngredientInRecipe()
                        .setRecipe(recipe).setIngredient(u.getIngredient()).setCategory(category)
                        .setSupplier(supplier).setBrand(brand);
                return ingredientInRecipe;
            }).collect(Collectors.toList());
            recipe.setIngredientInRecipe(ingredientInRecipes).setCategoriesForRecipe(addCategories(t));

            recipes.add(recipe);
        });
        recipeRepo.saveAll(recipes);
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
        if (CollectionUtils.isEmpty(t.getAddCategories())) {
            return null;
        } else {
            categoryFors = t.getAddCategories().stream()
                    .map(u ->
                    {
                        try {
                            categoryRepo.save(u.getCategory());
                            log.info("category added - {} for recipe- {}",u.getCategory().getTitle(),recipe.getTitle());
                        } catch (Exception e) {
                            log.error("Exception in saving category - {}, with error {}", u, e.getMessage());
                        }

                        return new CategoryFor().setRecipe(recipe)
                                .setCategory(u.getCategory());
                    }).collect(Collectors.toList());
        }
        return categoryFors;
    }


    private List<CategoryFor> addCategories(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<CategoryFor> categoryFors;
        if (CollectionUtils.isEmpty(t.getAddCategories())) {
            return null;
        } else {
            categoryFors = t.getAddCategories().stream()
                    .map(u ->
                    {
                        try {
                            categoryRepo.save(u.getCategory());
                            log.info("category added - {} for ingredient- {}",u.getCategory().getTitle(),ingredient.getTitle());
                        } catch (Exception e) {
                            log.error("Exception in saving category - {}, with error {}", u, e.getMessage());
                        }

                        return new CategoryFor().setIngredient(ingredient)
                                .setCategory(u.getCategory());
                    }).collect(Collectors.toList());
        }
        return categoryFors;
    }


    private List<BrandForIngredient> addBrands(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<BrandForIngredient> brandForIngredients;
        if (CollectionUtils.isEmpty(t.getAddBrands())) {
            return null;
        } else {
            brandForIngredients = t.getAddBrands().stream()
                    .map(u ->
                    {
                        try {
                            brandRepo.save(u.getBrand());
                            log.info("brand added - {} for ingredient- {}",u.getBrand().getTitle(),ingredient.getTitle());
                        } catch (Exception e) {
                            log.error("Exception in saving brand - {}", u, e);
                        }

                        return new BrandForIngredient().setIngredient(ingredient)
                                .setBrand(u.getBrand());
                    }).collect(Collectors.toList());
        }
        return brandForIngredients;
    }



    private List<SupplierForIngredient> addSupplier(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<SupplierForIngredient> supplierForIngredients;
        if (CollectionUtils.isEmpty(t.getAddSuppliers())) {
            return null;
        } else {
            supplierForIngredients = t.getAddSuppliers().stream()
                    .map(u -> {

                        try {
                            supplierRepo.save(u.getSupplier());
                            log.info("supplier added - {} for ingredient- {}",u.getSupplier().getTitle(),ingredient.getTitle());
                        } catch (Exception e) {
                            log.error("Exception in saving supplier - {}", u, e);
                        }
                        return new SupplierForIngredient().setIngredient(ingredient)
                                .setSupplier(u.getSupplier());
                    }).collect(Collectors.toList());
        }
        return supplierForIngredients;
    }

}
