package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Supplier;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "supplier_for_ingredient")
@Table(indexes = { @Index(columnList = "ingredient_id") },
		uniqueConstraints =@UniqueConstraint(columnNames = {"ingredient_id", "supplier_id"}))
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SupplierForIngredient extends BaseEntity {

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "ingredient_id", nullable = false)
	private Ingredient ingredient;

	@ManyToOne
	@JoinColumn(name = "supplier_id")
	private Supplier supplier;

}