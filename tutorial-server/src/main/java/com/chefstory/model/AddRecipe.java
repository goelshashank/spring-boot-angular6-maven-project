package com.chefstory.model;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.chefstory.entity.Recipe;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter
@Setter
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AddRecipe {

	@NotNull Recipe recipe;
	List<IngComp> ingredientComp;
	List<RecipeComp> recipeComp;
}
