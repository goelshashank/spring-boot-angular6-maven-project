package com.chefstory.entity.linkent;

import com.chefstory.entity.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "ingredient_in_recipe")
@Table(indexes = {@Index(columnList = "recipe_id")},
        uniqueConstraints = @UniqueConstraint(columnNames = {"ingredient_id",
                "recipe_id", "supplier_id", "brand_id", "category_id","status"}))
@JsonInclude(JsonInclude.Include.NON_NULL)
public class IngredientInRecipe extends BaseEntity {

    @JsonBackReference(value = "ingredientInRecipe")
    @ManyToOne
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "quantity_unit")
    private Double quantityUnit;

    @Column(name = "unit")
    private String unit;

    public IngredientInRecipe setRecipe(Recipe recipe) {
        if(StringUtils.isNotBlank(recipe.getTitle()))
             this.recipe = recipe;
        return this;
    }

    public IngredientInRecipe setIngredient(Ingredient ingredient) {
        if(StringUtils.isNotBlank(ingredient.getTitle()))
               this.ingredient = ingredient;
        return this;
    }

    public IngredientInRecipe setSupplier(Supplier supplier) {
        if(StringUtils.isNotBlank(supplier.getTitle()))
              this.supplier = supplier;
        return this;
    }

    public IngredientInRecipe setBrand(Brand brand) {
        if(StringUtils.isNotBlank(brand.getTitle()))
              this.brand = brand;
        return this;
    }

    public IngredientInRecipe setCategory(Category category) {
        if(StringUtils.isNotBlank(category.getTitle()))
             this.category = category;
        return this;
    }
}
