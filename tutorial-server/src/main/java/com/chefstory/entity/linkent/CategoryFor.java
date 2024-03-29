package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Category;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data @Accessors(chain = true) @Entity(name = "category_for") @Table(indexes = { @Index(columnList = "ingredient_id"),
		@Index(columnList = "recipe_id") }, uniqueConstraints = { @UniqueConstraint(columnNames = { "ingredient_id", "category_id" }),
		@UniqueConstraint(columnNames = { "recipe_id",
				"category_id" }) }) @JsonInclude(JsonInclude.Include.NON_NULL) public class CategoryFor extends BaseEntity {

	@JsonBackReference(value = "categoriesForIngredient") @ManyToOne @JoinColumn(name = "ingredient_id") private Ingredient ingredient;

	@ManyToOne @JoinColumn(name = "category_id") private Category category;

	@JsonBackReference(value = "categoriesForRecipe") @ManyToOne @JoinColumn(name = "recipe_id") private Recipe recipe;

	public CategoryFor setRecipe(Recipe recipe) {
		if (StringUtils.isNotBlank(recipe.getTitle()))
			this.recipe = recipe;
		return this;
	}

	public CategoryFor setIngredient(Ingredient ingredient) {
		if (StringUtils.isNotBlank(ingredient.getTitle()))
			this.ingredient = ingredient;
		return this;
	}
}
