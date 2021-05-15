package com.chefstory.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter @Setter @ToString @JsonInclude(JsonInclude.Include.NON_NULL) public class AddIngredientToRecipe {

	@NotNull Integer recipeId;
	List<Integer> ingredientCompIds;
	List<Integer> recipeCompIds;
}
