package com.chefstory.model;

import com.chefstory.entity.Ingredient;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AddIngredient {

	@NotNull Ingredient ingredient;
	List<AddSupplier> addSuppliers;
	List<AddBrand> addBrands;
	List<AddCategory> addCategories;

}
