package com.chefstory.entity.pojo;

import java.util.Arrays;
import java.util.Optional;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 19/12/21
 */
public enum Quantity implements Unit{


	Each ("each","") , Dozen ("dozen","12 each"),
	Hundred ("hundred","100 each"), Thousand("thousand","1000 each"), Million("million","1000000 each");

	private final String abv;
	private final String detail;

	Quantity(String abv, String detail) {
		this.abv = abv;
		this.detail = detail;
	}

	public static Optional<Quantity> getQuantityByAbv(String abv) {
		return Arrays.stream(Quantity.values())
				.filter(t -> t.abv.equalsIgnoreCase(abv))
				.findFirst();
	}

	public String getDescription(){
		return abv + " " +detail;
	}

}
