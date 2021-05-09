package com.chefstory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "ingredient_In_Receipe")
public class Ingredient_In_Receipe extends BaseEntity{

	@Column(name="receipe_id", nullable=false)
	private Long receipeId;

	@ManyToOne
	@JoinColumn(name="ingredient_id", nullable=false)
	private Ingredient ingredient;

}
