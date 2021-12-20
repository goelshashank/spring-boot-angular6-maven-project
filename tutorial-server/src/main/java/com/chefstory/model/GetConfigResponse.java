package com.chefstory.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
	Map<String, List<UnitWrap>> unitsDetailed;


	public void setUnitsDetailed(Map<String, List<Unit>> unitMap) {
		Map<String, List<UnitWrap>> map = new HashMap<>();
		unitMap.forEach((k, v) -> {
			List<UnitWrap> l = v.stream().map(t -> {
				UnitWrap unitWrap = new UnitWrap();
				unitWrap.setUnit(t);
				unitWrap.setDescription(t.toString());
				return unitWrap;
			}).collect(Collectors.toList());
			map.put(k, l);
		});
		unitsDetailed = map;

	}

}
