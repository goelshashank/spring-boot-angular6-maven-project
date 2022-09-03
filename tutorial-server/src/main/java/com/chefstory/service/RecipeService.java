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
import java.util.Objects;
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
        ingredientRepo.saveAll(addIngredients.stream().map(t -> {
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
            if (CollectionUtils.isEmpty(t.getRecipe().getIngredientInRecipe()))
                return;

            Recipe recipe = t.getRecipe();

            updateIngredient(t.getRecipe().getIngredientInRecipe().stream().map(i-> new AddIngredient().setIngredient(i.getIngredient())).collect(Collectors.toList()));

            List<IngredientInRecipe> ingredientInRecipes = t.getRecipe().getIngredientInRecipe().stream().map(u -> {


                IngredientInRecipe ingredientInRecipe = new IngredientInRecipe()
                        .setRecipe(recipe).setIngredient(u.getIngredient()).setCategory(u.getCategory())
                        .setSupplier( u.getSupplier()).setBrand(u.getBrand());
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
        if (CollectionUtils.isEmpty(t.getRecipe().getCategoriesForRecipe())) {
            return null;
        } else {
            categoryFors = t.getRecipe().getCategoriesForRecipe().stream()
                    .map(u ->
                    {
                            categoryRepo.save(u.getCategory());
                            log.info("category added - {} for recipe- {}",u.getCategory().getTitle(),recipe.getTitle());
                        return new CategoryFor().setRecipe(recipe)
                                .setCategory(u.getCategory());
                    }).collect(Collectors.toList());
        }
        return categoryFors;
    }


    private List<CategoryFor> addCategories(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<CategoryFor> categoryFors;
        if (CollectionUtils.isEmpty(t.getIngredient().getCategoriesForIngredient())) {
            return null;
        } else {
            categoryFors = t.getIngredient().getCategoriesForIngredient().stream()
                    .map(u ->
                    {
                        try {
                            categoryRepo.save(u.getCategory());
                            log.info("category added - {} for ingredient- {}", u.getCategory().getTitle(), ingredient.getTitle());
                            return new CategoryFor().setIngredient(ingredient)
                                    .setCategory(u.getCategory());
                        }catch (Exception e) {
                            log.warn("Exception in adding category {}",e.getMessage());
                            return null;
                        }
                    }).filter(u-> u!=null).collect(Collectors.toList());
        }
        return categoryFors;
    }


    private List<BrandForIngredient> addBrands(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<BrandForIngredient> brandForIngredients;
        if (CollectionUtils.isEmpty(t.getIngredient().getBrandForIngredients())) {
            return null;
        } else {
            brandForIngredients = t.getIngredient().getBrandForIngredients().stream()
                    .map(u ->
                    {
                        try {
                            brandRepo.save(u.getBrand());
                            log.info("brand added - {} for ingredient- {}",u.getBrand().getTitle(),ingredient.getTitle());
                        return new BrandForIngredient().setIngredient(ingredient)
                                .setBrand(u.getBrand());
                        }catch (Exception e) {
                            log.warn("Exception in adding brand {}",e.getMessage());
                            return null;
                        }
                    }).filter(u-> u!=null).collect(Collectors.toList());
        }
        return brandForIngredients;
    }



    private List<SupplierForIngredient> addSupplier(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<SupplierForIngredient> supplierForIngredients;
        if (CollectionUtils.isEmpty(t.getIngredient().getSupplierForIngredients())) {
            return null;
        } else {
            supplierForIngredients = t.getIngredient().getSupplierForIngredients().stream()
                    .map(u -> {
                        try {
                            supplierRepo.save(u.getSupplier());
                            log.info("supplier added - {} for ingredient- {}",u.getSupplier().getTitle(),ingredient.getTitle());
                        return new SupplierForIngredient().setIngredient(ingredient)
                                .setSupplier(u.getSupplier());
                        }catch (Exception e) {
                            log.warn("Exception in adding supplier {}",
                                    e.getMessage());
                            return null;
                        }
                    }).filter(u-> u!=null).collect(Collectors.toList());

        }
        return supplierForIngredients;
    }

}
