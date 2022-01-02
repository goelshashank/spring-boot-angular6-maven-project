package com.chefstory.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "ingredient")
@Table(indexes = { @Index(columnList = "category"), @Index(columnList = "title") })
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class Ingredient extends BaseEntity {

	@Column(name = "title", unique = true, nullable = false)
	@NotBlank
	private String title;

	@Column(name = "category")
	private String category;

	@Column(name = "sku_cost")
	private Double skuCost;

	@Column(name = "sku_qty")
	private Double skuQty;

	@Column(name = "unit")
	//@Enumerated(EnumType.STRING)
	private String unit;

	@Column(name = "photo_id")
	private String photoId;

	@Column(name = "video_id")
	private String videoId;

	@JsonManagedReference
	@OneToMany(mappedBy = "ingredient",cascade = CascadeType.ALL)
	private List<SupplierForIngredient> supplierForIngredients;

	@JsonManagedReference
	@OneToMany(mappedBy = "ingredient",cascade = CascadeType.ALL)
	private List<BrandForIngredient> brandForIngredients;

	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private Status status;

	@JsonProperty("perUnitCost")
	private Double getPerUnitCost(){
		return skuCost/skuQty;
	}
}
