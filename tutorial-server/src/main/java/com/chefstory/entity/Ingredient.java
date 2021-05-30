package com.chefstory.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

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

	@Column(name = "title", unique = true,nullable = false)
	@NotBlank
	private String title;

	@Column(name = "category")
	private String category;

	@Column(name = "per_unit_cost")
	private Double perUnitCost;

	@Column(name = "unit")
	@Enumerated(EnumType.STRING)
	private Unit unit;

	@Column(name = "photo_id")
	private String photoId;

	@Column(name = "video_id")
	private String videoId;

	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private Status status;

}
