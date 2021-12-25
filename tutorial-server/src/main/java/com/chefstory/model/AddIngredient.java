package com.chefstory.model;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.chefstory.entity.BrandForIngredient;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.SupplierForIngredient;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;

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

}
