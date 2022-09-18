package com.chefstory.model;

import com.chefstory.entity.pojo.Unit;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 20/12/21
 */
@Data @JsonInclude(JsonInclude.Include.NON_NULL) public class UnitWrap {
	private Unit unit;
	private String description;
}
