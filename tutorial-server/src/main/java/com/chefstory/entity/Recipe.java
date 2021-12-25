package com.chefstory.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "recipe")
@Table(indexes = { @Index(columnList = "title"), @Index(columnList = "category"), @Index(columnList = "sub_category") })
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Recipe extends BaseEntity {

	@Column(name = "title", nullable = false)
	@NotBlank
	private String title;
	@Column(name = "category")
	private String category;
	@Column(name = "sub_category")
	private String subCategory;
	@Column(name = "course")
	private String course;
	@Column(name = "collections")
	private String collections;
	@Column(name = "source")
	private String source;
	@Column(name = "serving")
	private String serving;
	@Column(name = "cook_time")
	private String cookTime;
	@Column(name = "prep_time")
	private String prepTime;
	@Column(name = "rating")
	private Integer rating;

	@JsonManagedReference
	@OneToMany(mappedBy = "recipe",cascade = CascadeType.ALL)
	private List<IngredientInRecipe> ingredientInRecipe;

	@Column(name = "instructions")
	private String instructions;
	@Column(name = "shelf_life")
	private String shelfLife;
	@Column(name = "remarks")
	private String remarks;
	@Column(name = "photo_id")
	private String photoId;
	@Column(name = "video_id")
	private String videoId;
	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private Status status;

}
