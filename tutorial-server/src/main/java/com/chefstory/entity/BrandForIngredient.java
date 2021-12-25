package com.chefstory.entity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

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
@Table(indexes = { @Index(columnList = "ingredient_id"), @Index(columnList = "brand_comp_id") })
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BrandForIngredient extends BaseEntity {

	@Column(name = "ingredient_id", nullable = false)
	private Long ingredientId;

	@ManyToOne
	@JoinColumn(name = "brand_comp_id")
	private Brand brandComp;

}