package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Brand;
import com.chefstory.entity.Ingredient;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.DynamicUpdate;

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
@Data @Accessors(chain = true) @Entity(name = "brand_for_ingredient") @Table(indexes = {
		@Index(columnList = "ingredient_id") }, uniqueConstraints = @UniqueConstraint(columnNames = { "ingredient_id",
		"brand_id" })) @JsonInclude(JsonInclude.Include.NON_NULL) public class BrandForIngredient extends BaseEntity {

	@JsonBackReference(value = "brandForIngredients") @ManyToOne @JoinColumn(name = "ingredient_id", nullable = false) private Ingredient ingredient;

	@ManyToOne @JoinColumn(name = "brand_id") private Brand brand;

	@Column(name = "sku_cost") private Double skuCost;

	@Column(name = "sku_qty") private Double skuQty;

	@JsonProperty("perUnitCost") private Double getPerUnitCost() {
		if (skuCost == null || skuQty == null)
			return 0.0;

		return skuCost / skuQty;
	}

	public BrandForIngredient setIngredient(Ingredient ingredient) {
		if (StringUtils.isNotBlank(ingredient.getTitle()))
			this.ingredient = ingredient;
		return this;
	}

	public BrandForIngredient setBrand(Brand brand) {
		if (StringUtils.isNotBlank(brand.getTitle()))
			this.brand = brand;
		return this;
	}
}
