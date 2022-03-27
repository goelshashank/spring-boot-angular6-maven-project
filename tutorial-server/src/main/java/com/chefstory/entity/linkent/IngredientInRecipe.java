package com.chefstory.entity.linkent;

import com.chefstory.entity.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

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
        uniqueConstraints = @UniqueConstraint(columnNames = {"ingredient_id", "recipe_id", "supplier_id", "brand_id", "category_id"}))
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

}
