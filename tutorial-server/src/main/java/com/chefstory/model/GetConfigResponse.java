package com.chefstory.model;

import java.util.List;

import com.chefstory.entity.Unit;

import lombok.Data;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 30/05/21
 */
@Data
public class GetConfigResponse {

	List<Unit> units;
}
