package com.chefstory.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 04/07/21
 */
@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class IngComp {

	@NotNull private Long id;
	private Double quantityUnit;
}
