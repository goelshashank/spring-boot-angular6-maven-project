package com.chefstory.entity.pojo;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 15/05/21
 */
public interface Unit {

    static Map<String, List<Unit>> values() {
        Map<String, List<Unit>> map = new HashMap<>();
        map.put("Quanity", Arrays.stream(Quantity.values()).map(t -> (Unit) t).collect(Collectors.toList()));
        map.put("Weight", Arrays.stream(Weight.values()).map(t -> (Unit) t).collect(Collectors.toList()));
        map.put("Time", Arrays.stream(Time.values()).map(t -> (Unit) t).collect(Collectors.toList()));
        map.put("Volume", Arrays.stream(Volume.values()).map(t -> (Unit) t).collect(Collectors.toList()));
        return map;
    }

    public String getDescription();

}
