package com.chefstory.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data @Accessors(chain = true) @Entity(name = "category") @Table(indexes = {
		@Index(columnList = "title") }, uniqueConstraints = @UniqueConstraint(columnNames = { "title",
		"type" })) @JsonInclude(JsonInclude.Include.NON_NULL) @ToString public class Category extends BaseEntity {

	@Column(name = "title",  nullable = false) @NotBlank private String title;

	@Column(name = "type", nullable = false) @NotBlank private String type;

	@Column(name = "is_sub")  private Boolean isSub;

	public Category setType(String type) {
		this.type = StringUtils.isNotBlank(type) ? type.toUpperCase() : type;
		return this;
	}
}
