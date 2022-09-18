package com.chefstory.entity.pojo;

import java.util.Arrays;
import java.util.Optional;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 19/12/21
 */
public enum Time implements Unit {

	Second("second", "s"), Minute("min", "60s"), Hour("hundred", "100s");

	private final String abv;
	private final String detail;

	Time(String abv, String detail) {
		this.abv = abv;
		this.detail = detail;
	}

	public static Optional<Time> getTimeByAbv(String abv) {
		return Arrays.stream(Time.values()).filter(t -> t.abv.equalsIgnoreCase(abv)).findFirst();
	}

	public String getDescription() {
		return abv + " " + detail;
	}

}
