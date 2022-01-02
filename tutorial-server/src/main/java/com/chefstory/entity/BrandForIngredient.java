package com.chefstory.entity;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.experimental.Accessors;

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
