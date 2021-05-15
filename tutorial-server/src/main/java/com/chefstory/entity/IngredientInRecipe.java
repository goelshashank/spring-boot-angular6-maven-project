package com.chefstory.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Accessors(chain = true) @Entity(name = "recipe_id") @Table(indexes = @Index(columnList = "recipe_id,ingredient_comp_id,recipe_comp_id")) @JsonInclude(JsonInclude.Include.NON_NULL) public class IngredientInRecipe
		extends BaseEntity {

	@Column(name = "recipe_id", nullable = false) private Integer recipeId;

	@ManyToOne @JoinColumn(name = "ingredient_comp_id") private Ingredient ingredient;

	@ManyToOne @JoinColumn(name = "recipe_comp_id") private Recipe recipe;

	@Column(name = "quantity_unit") private Double quantityUnit;

}
