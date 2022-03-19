package com.chefstory.entity;

import com.chefstory.entity.linkent.BrandForIngredient;
import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.SupplierForIngredient;
import com.chefstory.entity.pojo.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "ingredient")
@Table(indexes = { @Index(columnList = "title") })
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class Ingredient extends BaseEntity {

	@Column(name = "title", unique = true, nullable = false)
	@NotBlank
	private String title;

	@Column(name = "sku_cost")
	private Double skuCost;

	@Column(name = "sku_qty")
	private Double skuQty;

	@Column(name = "unit")
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

	@JsonManagedReference
	@OneToMany(mappedBy = "ingredient",cascade = CascadeType.ALL)
	private List<CategoryFor> categoriesForIngredient;

	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private Status status;

	@JsonProperty("perUnitCost")
	private Double getPerUnitCost(){
		if(skuCost==null || skuQty ==null)
			return 0.0;

		return skuCost/skuQty;
	}

	@Transient
	@JsonProperty("quantityUnit")
	private Double quantityUnit;

}
