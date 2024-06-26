package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Brand;
import com.chefstory.entity.Category;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.Supplier;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.Column;
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
@Data @Accessors(chain = true) @Entity(name = "ingredient_in_recipe") @Table(indexes = {
		@Index(columnList = "recipe_id") }, uniqueConstraints = @UniqueConstraint(columnNames = { "ingredient_id", "recipe_id",
		"supplier_id", "brand_id", "category_id" })) @JsonInclude(JsonInclude.Include.NON_NULL) public class IngredientInRecipe
		extends BaseEntity {

	@JsonBackReference(value = "ingredientInRecipe") @ManyToOne @JoinColumn(name = "recipe_id", nullable = false) private Recipe recipe;

	@ManyToOne @JoinColumn(name = "sub_recipe_id") private Recipe subRecipe;

	@ManyToOne @JoinColumn(name = "ingredient_id") private Ingredient ingredient;

	@ManyToOne @JoinColumn(name = "supplier_id") private SupplierForIngredient supplier;

	@ManyToOne @JoinColumn(name = "brand_id") private BrandForIngredient brand;

	@ManyToOne @JoinColumn(name = "category_id") private Category category;

	@Column(name = "qty") private Double qty=0.0;

	public IngredientInRecipe setIngRecipe(Recipe subRecipe) {
		if(subRecipe!=null && StringUtils.isNotBlank(subRecipe.getTitle()))
			this.subRecipe = subRecipe;

		if(this.subRecipe.getTitle().equals(recipe.getTitle()))
			throw new RuntimeException("Sub recipe can't be same as recipe "+ this.subRecipe.getTitle());

		return this;
	}

	public IngredientInRecipe setRecipe(Recipe recipe) {
		if (recipe!=null && StringUtils.isNotBlank(recipe.getTitle()))
			this.recipe = recipe;
		return this;
	}

	public IngredientInRecipe setIngredient(Ingredient ingredient) {
		if (ingredient!=null && StringUtils.isNotBlank(ingredient.getTitle()))
			this.ingredient = ingredient;
		return this;
	}

	public IngredientInRecipe setSupplier(SupplierForIngredient supplier) {
		if (supplier!=null && StringUtils.isNotBlank(supplier.getSupplier().getTitle()))
			this.supplier = supplier;
		return this;
	}

	public IngredientInRecipe setBrand(BrandForIngredient brand) {
		if (brand!=null && StringUtils.isNotBlank(brand.getBrand().getTitle()))
			this.brand = brand;
		return this;
	}

	public IngredientInRecipe setCategory(Category category) {
		if (category!=null && StringUtils.isNotBlank(category.getTitle()))
			this.category = category;
		return this;
	}
}
