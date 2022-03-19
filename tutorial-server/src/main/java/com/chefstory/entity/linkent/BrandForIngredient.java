package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Brand;
import com.chefstory.entity.Ingredient;
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
@Entity(name = "brand_for_ingredient")
@Table(indexes = { @Index(columnList = "ingredient_id"), @Index(columnList = "brand_id")},
		uniqueConstraints =@UniqueConstraint(columnNames = {"ingredient_id", "brand_id"}))
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BrandForIngredient extends BaseEntity {

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "ingredient_id", nullable = false)
	private Ingredient ingredient;

	@ManyToOne
	@JoinColumn(name = "brand_id")
	private Brand brand;

}
