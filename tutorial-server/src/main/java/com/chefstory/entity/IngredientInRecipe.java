package com.chefstory.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "ingredient_in_recipe")
@Table(indexes = { @Index(columnList = "recipe_id"), @Index(columnList = "ingredient_comp_id"),
		@Index(columnList = "recipe_comp_id") })
@JsonInclude(JsonInclude.Include.NON_NULL)
public class IngredientInRecipe extends BaseEntity {

	@Column(name = "recipe_id", nullable = false)
	private Long recipeId;

	@ManyToOne
	@JoinColumn(name = "ingredient_comp_id")
	private Ingredient ingredientComp;

	@ManyToOne
	@JoinColumn(name = "recipe_comp_id")
	private Recipe recipeComp;

	@Column(name = "quantity_unit")
	private Double quantityUnit;

	@Column(name = "unit")
	private String unit;

}
