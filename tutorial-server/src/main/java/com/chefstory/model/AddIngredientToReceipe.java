package com.chefstory.model;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Receipe;
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
public class AddIngredientToReceipe {

	Ingredient ingredient;
	Receipe receipe;
}
