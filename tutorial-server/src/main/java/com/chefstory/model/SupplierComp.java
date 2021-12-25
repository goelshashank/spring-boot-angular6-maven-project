package com.chefstory.model;

import javax.validation.constraints.NotNull;

import com.chefstory.entity.Supplier;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 04/07/21
 */
@Data
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SupplierComp {

	@NotNull private Long id;
	private Supplier supplier;

	public SupplierComp setId(Long id) {
		this.id = id;
		this.supplier =new Supplier();
		supplier.setId(id);
		return this;
	}
}
