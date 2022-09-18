package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Supplier;
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
@Data @Accessors(chain = true) @Entity(name = "supplier_for_ingredient") @Table(indexes = {
		@Index(columnList = "ingredient_id") }, uniqueConstraints = @UniqueConstraint(columnNames = { "ingredient_id",
		"supplier_id" })) @JsonInclude(JsonInclude.Include.NON_NULL) public class SupplierForIngredient extends BaseEntity {

	@JsonBackReference(value = "supplierForIngredients") @ManyToOne @JoinColumn(name = "ingredient_id", nullable = false) private Ingredient ingredient;

	@ManyToOne @JoinColumn(name = "supplier_id") private Supplier supplier;

	public SupplierForIngredient setIngredient(Ingredient ingredient) {
		if (StringUtils.isNotBlank(ingredient.getTitle()))
			this.ingredient = ingredient;
		return this;
	}

	public SupplierForIngredient setSupplier(Supplier supplier) {
		if (StringUtils.isNotBlank(supplier.getTitle()))
			this.supplier = supplier;
		return this;
	}
}
