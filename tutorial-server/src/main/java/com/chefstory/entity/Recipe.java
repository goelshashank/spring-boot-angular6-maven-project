package com.chefstory.entity;

import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.IngredientInRecipe;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data @Accessors(chain = true) @Entity(name = "recipe") @Table(indexes = {
		@Index(columnList = "title") }) @JsonInclude(JsonInclude.Include.NON_NULL) public class Recipe extends BaseEntity {

	@Column(name = "title", unique = true, nullable = false) @NotBlank private String title;
	@Column(name = "course") private String course;
	@Column(name = "collection") private String collection;
	@Column(name = "source") private String source;
	@Column(name = "sourceURL") private String sourceURL;
	@Column(name = "method") private String method;
	@Column(name = "notes") private String notes;
	@Column(name = "serving_qty") private Double servingQty;
	@Column(name = "cook_time") private String cookTime;
	@Column(name = "prep_time") private String prepTime;
	@Column(name = "rating") private Integer rating;
	@Column(name = "unit") private String unit;

	@JsonManagedReference(value = "ingredientInRecipe") @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL) private List<IngredientInRecipe> ingredientInRecipe;

	@JsonManagedReference(value = "categoriesForRecipe") @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL) private List<CategoryFor> categoriesForRecipe;

	@Column(name = "instructions") private String instructions;
	@Column(name = "shelf_life") private String shelfLife;
	@Column(name = "remarks") private String remarks;
	@Column(name = "photo_id") private String photoId;
	@Column(name = "video_id") private String videoId;

	@JsonIgnore public List<Long> getIngredientIds() {
		return this.getIngredientInRecipe().stream().map(t -> t.getId()).filter(t -> t != null).collect(Collectors.toList());
	}

	@JsonIgnore public List<Long> getCategoryForIds() {
		return this.getCategoriesForRecipe().stream().map(t -> t.getId()).filter(t -> t != null).collect(Collectors.toList());
	}

}
