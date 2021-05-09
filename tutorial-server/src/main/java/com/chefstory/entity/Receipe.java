package com.chefstory.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;
import java.util.Set;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "receipe")
public class Receipe extends BaseEntity{

	@Column(name = "title")
	private String  title;
	@Column(name = "categories")
	private String  categories;
	@Column(name = "course")
	private String  course;
	@Column(name = "collections")
	private String  collections;
	@Column(name = "source")
	private String  source;
	@Column(name = "serving")
	private String  serving;
	@Column(name = "cook_time")
	private String  cookTime;
	@Column(name = "prep_time")
	private String  prepTime;
	@Column(name = "rating")
	private Integer  rating;

	@OneToMany
	@JoinColumn(name="receipe_id")
	private List<Ingredient_In_Receipe> ingredientInReceipes;

	@Column(name = "instructions")
	private String instructions;
	@Column(name = "shelf_life")
	private String shelfLife;
	@Column(name = "remarks")
	private String remarks;


}
