package com.chefstory.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

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
@Entity(name = "supplier")
@Table
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class Supplier extends BaseEntity {

	@Column(name = "title", unique = true, nullable = false)
	@NotBlank
	private String title;

}