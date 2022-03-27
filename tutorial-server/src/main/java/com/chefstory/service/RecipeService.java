package com.chefstory.service;

import com.chefstory.entity.*;
import com.chefstory.entity.linkent.BrandForIngredient;
import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.IngredientInRecipe;
import com.chefstory.entity.linkent.SupplierForIngredient;
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
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static com.chefstory.utils.Constants.*;

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
    private Supplier defaultSupplier;
    private Brand defaultBrand;
    private Category defaultIngredientCategory;
    private Category defaultRecipeCategory;

    @PostConstruct
    public void init() {
        defaultSupplier = CollectionUtils.isEmpty(supplierRepo.findByTitle(DEFAULT)) ? supplierRepo.save(new Supplier().setTitle(DEFAULT)) :
                supplierRepo.findByTitle(DEFAULT).get(0);
        defaultBrand = CollectionUtils.isEmpty(brandRepo.findByTitle(DEFAULT)) ? brandRepo.save(new Brand().setTitle(DEFAULT)) :
                brandRepo.findByTitle(DEFAULT).get(0);
        defaultIngredientCategory = CollectionUtils.isEmpty(categoryRepo.findByTitleAndType(DEFAULT, INGREDIENT)) ? categoryRepo.save(new Category().setTitle(DEFAULT).setType(INGREDIENT)) :
                categoryRepo.findByTitle(DEFAULT).get(0);
        defaultRecipeCategory = CollectionUtils.isEmpty(categoryRepo.findByTitleAndType(DEFAULT, RECIPE)) ? categoryRepo.save(new Category().setTitle(DEFAULT).setType(RECIPE)) :
                categoryRepo.findByTitle(DEFAULT).get(0);
    }


    public List<SupplierForIngredient> addSupplier(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<SupplierForIngredient> supplierForIngredients;
        if (CollectionUtils.isEmpty(t.getAddSuppliers())) {
            supplierForIngredients = Arrays.asList(new SupplierForIngredient()
                    .setIngredient(ingredient).setSupplier((
                            CollectionUtils.isEmpty(t.getAddSuppliers()) ? defaultSupplier :
                                    t.getAddSuppliers().get(0).getSupplier())));
        } else {
            supplierForIngredients = t.getAddSuppliers().stream()
                    .map(u -> {

                        try {
                            supplierRepo.save(u.getSupplier());
                        } catch (Exception e) {
                            log.error("Exception in saving supplier - {}, with error {}", u, e.getMessage());
                        }
                        return new SupplierForIngredient().setIngredient(ingredient)
                                .setSupplier(u.getSupplier());
                    }).collect(Collectors.toList());
        }
        return supplierForIngredients;
    }


    public List<CategoryFor> addCategories(AddRecipe t) {
        Recipe recipe = t.getRecipe();
        List<CategoryFor> categoryFors;
        if (CollectionUtils.isEmpty(t.getAddCategories())) {
            categoryFors = Arrays.asList(new CategoryFor()
                    .setRecipe(recipe).setCategory((
                            CollectionUtils.isEmpty(t.getAddCategories()) ? defaultRecipeCategory :
                                    t.getAddCategories().get(0).getCategory())));
        } else {
            categoryFors = t.getAddCategories().stream()
                    .map(u ->
                    {
                        try {
                            categoryRepo.save(u.getCategory());
                        } catch (Exception e) {
                            log.error("Exception in saving category - {}, with error {}", u, e.getMessage());
                        }

                        return new CategoryFor().setRecipe(recipe)
                                .setCategory(u.getCategory());
                    }).collect(Collectors.toList());
        }
        return categoryFors;
    }


    public List<CategoryFor> addCategories(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<CategoryFor> categoryFors;
        if (CollectionUtils.isEmpty(t.getAddCategories())) {
            categoryFors = Arrays.asList(new CategoryFor()
                    .setIngredient(ingredient).setCategory((
                            CollectionUtils.isEmpty(t.getAddCategories()) ? defaultIngredientCategory :
                                    t.getAddCategories().get(0).getCategory())));
        } else {
            categoryFors = t.getAddCategories().stream()
                    .map(u ->
                    {
                        try {
                            categoryRepo.save(u.getCategory());
                        } catch (Exception e) {
                            log.error("Exception in saving category - {}, with error {}", u, e.getMessage());
                        }

                        return new CategoryFor().setIngredient(ingredient)
                                .setCategory(u.getCategory());
                    }).collect(Collectors.toList());
        }
        return categoryFors;
    }


    public List<BrandForIngredient> addBrands(AddIngredient t) {
        Ingredient ingredient = t.getIngredient();
        List<BrandForIngredient> brandForIngredients;
        if (CollectionUtils.isEmpty(t.getAddBrands())) {
            brandForIngredients = Arrays.asList(new BrandForIngredient()
                    .setIngredient(ingredient).setBrand((
                            CollectionUtils.isEmpty(t.getAddBrands()) ? defaultBrand :
                                    t.getAddBrands().get(0).getBrand())));
        } else {
            brandForIngredients = t.getAddBrands().stream()
                    .map(u ->
                    {
                        try {
                            brandRepo.save(u.getBrand());
                        } catch (Exception e) {
                            log.error("Exception in saving brand - {}, with error {}", u, e.getMessage());
                        }

                        return new BrandForIngredient().setIngredient(ingredient)
                                .setBrand(u.getBrand());
                    }).collect(Collectors.toList());
        }
        return brandForIngredients;
    }


/*
    public void updateIngredient(List<AddIngredient> addIngredients) {
        addIngredients.forEach(t -> {
            try {
                Ingredient ingredient = t.getIngredient().setBrandForIngredients(addBrands(t))
                        .setSupplierForIngredients(addSupplier(t));
                ingredientRepo.save(ingredient);
            }catch (Exception e){
                log.error("Error in updating ingredient {}",t.getIngredient(),e);
            }
        });
    }
*/

    public void addIngredient(List<AddIngredient> addIngredients) {
        List<Ingredient> list = new ArrayList<>();
        addIngredients.forEach(t -> {
            Ingredient ingredient = t.getIngredient().setCategoriesForIngredient(addCategories(t))
                    .setBrandForIngredients(addBrands(t))
                    .setSupplierForIngredients(addSupplier(t));
            list.add(ingredient);
        });
        ingredientRepo.saveAll(list);
    }


    public void addRecipe(List<AddRecipe> addRecipeList) {
        List<Recipe> recipes = new ArrayList<>();
        addRecipeList.forEach(t -> {
            if (CollectionUtils.isEmpty(t.getAddIngredients()))
                return;

            Recipe recipe = t.getRecipe();

            CompletableFuture.runAsync(() ->
                    addIngredient(t.getAddIngredients()));

            List<IngredientInRecipe> ingredientInRecipes = t.getAddIngredients().stream().map(u -> {

                Supplier supplier = CollectionUtils.isEmpty(u.getAddSuppliers()) ? defaultSupplier : u.getAddSuppliers().get(0).getSupplier();
                Brand brand = CollectionUtils.isEmpty(u.getAddBrands()) ? defaultBrand : u.getAddBrands().get(0).getBrand();
                Category category = CollectionUtils.isEmpty(u.getAddCategories()) ? defaultRecipeCategory : u.getAddCategories().get(0).getCategory();

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


}
