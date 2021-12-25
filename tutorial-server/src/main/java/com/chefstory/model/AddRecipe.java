package com.chefstory.model;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.chefstory.entity.Recipe;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AddRecipe {

	@NotNull Recipe recipe;
	List<AddIngredient> addIngredients;
}
