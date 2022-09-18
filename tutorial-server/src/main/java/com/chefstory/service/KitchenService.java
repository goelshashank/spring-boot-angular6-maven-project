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
import com.chefstory.repository.linkrepo.CategoryForRepo;
import com.chefstory.repository.linkrepo.IngredientInRecipeRepo;
import com.chefstory.repository.linkrepo.SupplierForIngredientRepo;
import com.chefstory.utils.FileUtils;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class KitchenService {

    @Autowired
    BrandForIngredientRepo brandForIngredientRepo;
    @Autowired
    BrandRepo brandRepo;
    @Autowired
    CategoryRepo categoryRepo;
    @Autowired
    CategoryForRepo categoryForRepo;
    @Autowired
    private RecipeRepo recipeRepo;
    @Autowired
    private IngredientInRecipeRepo ingredientInRecipeRepo;
    @Autowired
    private IngredientRepo ingredientRepo;
    @Autowired
    private FileUtils fileUtils;
    @Autowired
    private SupplierRepo supplierRepo;
    @Autowired
    private SupplierForIngredientRepo supplierForIngredientRepo;

    @PostConstruct
    public void init() {
    }

    public void addIngredient(List<AddIngredient> addIngredients) {
        ingredientRepo.saveAll(addIngredients.stream().map(t -> {
            t.getIngredient().setCategoriesForIngredient(addCategories(t))
                    .setBrandForIngredients(addBrands(t))
                    .setSupplierForIngredients(addSupplier(t));
            return t.getIngredient();
        }).collect(Collectors.toList()));
    }

    public void updateIngredient(List<AddIngredient> updateIngredients) {
        updateIngredients.forEach(u -> {

            Ingredient ingredient = u.getIngredient();
            boolean createEntirelyNew=false;
            if(createEntirelyNew) {
                markIngredientInActive(ingredient);

                ingredient.setId(null);
                ingredient.setStatus(Status.ACTIVE);
                if (!CollectionUtils.isEmpty(ingredient.getBrandForIngredients()))
                    ingredient.getBrandForIngredients().forEach(t -> t.setId(null));
                if (!CollectionUtils.isEmpty(ingredient.getSupplierForIngredients()))
                    ingredient.getSupplierForIngredients().forEach(t -> t.setId(null));
                if (!CollectionUtils.isEmpty(ingredient.getCategoriesForIngredient()))
                    ingredient.getCategoriesForIngredient().forEach(t -> t.setId(null));

                addIngredient(Arrays.asList(new AddIngredient().setIngredient(ingredient)));
            }else{


                Ingredient oldIng=ingredientRepo.findById(ingredient.getId());
                oldIng.getSupplierForIngredients().forEach(t-> {
                            if(!(ingredient.getSupplierForIngredients().stream().map(r->r.getId()).filter(r-> r!=null).collect(Collectors.toList()))
                                    .contains(t.getId())) {
                                log.info("To delete supplier  - {}",t.getId());
                                supplierForIngredientRepo.delete(t);
                            }
                        });
                oldIng.getBrandForIngredients().forEach(t-> {
                    if(!( ingredient.getBrandForIngredients().stream().map(r->r.getId()).filter(r-> r!=null).collect(Collectors.toList()))
                            .contains(t.getId())) {
                        log.info("To delete brand  - {}",t.getId());
                        brandForIngredientRepo.delete(t);
                    }
                });
                oldIng.getCategoriesForIngredient().forEach(t-> {
                    if(!(ingredient.getCategoriesForIngredient().stream().map(r->r.getId()).filter(r-> r!=null).collect(Collectors.toList()))
                            .contains(t.getId())) {
                        log.info("To delete category  - {}",t.getId());
                        categoryForRepo.delete(t);
                    }
                });
                addIngredient(Arrays.asList(new AddIngredient().setIngredient(ingredient)));
            }
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

                IngredientInRecipe ingredientInRecipe = new IngredientInRecipe()
                        .setRecipe(recipe).setIngredient(u.getIngredient()).setCategory(u.getCategory())
                        .setSupplier(u.getSupplier()).setBrand(u.getBrand());
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
            boolean createEntirelyNew=false;
            if(createEntirelyNew) {

                markRecipeInActive(recipe);

                recipe.setId(null);
                recipe.setStatus(Status.ACTIVE);
                if (!CollectionUtils.isEmpty(recipe.getIngredientInRecipe()))
                    recipe.getIngredientInRecipe().forEach(t -> t.setId(null));
                if (!CollectionUtils.isEmpty(recipe.getCategoriesForRecipe()))
                    recipe.getCategoriesForRecipe().forEach(t -> t.setId(null));

                addRecipe(Arrays.asList(new AddRecipe().setRecipe(recipe)));
            }else{

                List<Long> newIngredientInRecipeList =
                        recipe.getIngredientInRecipe().stream().map(t->t.getId()).filter(t-> t!=null).collect(Collectors.toList());

                List<Long> newCategoryFors=
                        recipe.getCategoriesForRecipe().stream().map(t->t.getId()).filter(t-> t!=null).collect(Collectors.toList());

                Recipe oldRecipe=recipeRepo.findById(recipe.getId());
                oldRecipe.getIngredientInRecipe().forEach(t-> {
                    if(!newIngredientInRecipeList.contains(t.getId())) {
                        ingredientInRecipeRepo.delete(t);
                    }
                });
                oldRecipe.getCategoriesForRecipe().forEach(t-> {
                    if(!newCategoryFors.contains(t.getId())) {
                        categoryForRepo.delete(t);
                    }
                });

                addRecipe(Arrays.asList(new AddRecipe().setRecipe(recipe)));
            }
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
            categoryFors = t.getRecipe().getCategoriesForRecipe().stream()
                    .map(u ->
                    {
                        categoryRepo.save(u.getCategory());
                        log.info("category added - {} for recipe- {}", u.getCategory().getTitle(), recipe.getTitle());
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
                        List<Category> categories=
                                categoryRepo.findByTitle(u.getCategory().getTitle());
                        if(CollectionUtils.isEmpty(categories)) {
                            categoryRepo.save(u.getCategory());
                        }else{
                            u.setCategory(categories.get(0));
                        }
                        log.info("category added - {} for ingredient- {}", u.getCategory().getTitle(), ingredient.getTitle());
                        return new CategoryFor().setIngredient(ingredient)
                                .setCategory(u.getCategory());
                    }).collect(Collectors.toList());
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
                        List<Brand> brands=
                                brandRepo.findByTitle(u.getBrand().getTitle());
                        if(CollectionUtils.isEmpty(brands)) {
                            brandRepo.save(u.getBrand());
                        }else{
                            u.setBrand(brands.get(0));
                        }
                            log.info("brand added - {} for ingredient- {}", u.getBrand().getTitle(), ingredient.getTitle());
                            return new BrandForIngredient().setIngredient(ingredient)
                                    .setBrand(u.getBrand());

                    }).collect(Collectors.toList());
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
                        List<Supplier> suppliers=
                                supplierRepo.findByTitle(u.getSupplier().getTitle());
                        if(CollectionUtils.isEmpty(suppliers)) {
                            supplierRepo.save(u.getSupplier());
                        }else{
                            u.setSupplier(suppliers.get(0));
                        }
                            log.info("supplier added - {} for ingredient- {}", u.getSupplier().getTitle(), ingredient.getTitle());
                            return new SupplierForIngredient().setIngredient(ingredient)
                                    .setSupplier(u.getSupplier());

                    }).collect(Collectors.toList());

        }
        return supplierForIngredients;
    }

    private void markIngredientInActive(Ingredient ingredient) {
        if(CollectionUtils.isEmpty(ingredientRepo.findByTitle(ingredient.getTitle())))
           return;

            Ingredient t = new Ingredient();
            t.setId(ingredient.getId());
            t.setTitle(ingredient.getTitle());
            t.setStatus(Status.INACTIVE);
            ingredientRepo.save(t);
    }

    private void markRecipeInActive(Recipe recipe) {
        if(CollectionUtils.isEmpty(recipeRepo.findByTitle(recipe.getTitle())))
            return;

        Recipe t = new Recipe();
        t.setId(recipe.getId());
        t.setTitle(recipe.getTitle());
        t.setStatus(Status.INACTIVE);
        recipeRepo.save(t);
    }

}

