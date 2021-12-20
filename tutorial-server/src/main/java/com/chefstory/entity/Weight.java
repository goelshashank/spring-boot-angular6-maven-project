package com.chefstory.entity;

import java.util.Arrays;
import java.util.Optional;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 19/12/21
 */
public enum Weight implements Unit{

	Kilogram ("kg","1000g") , Gram ("g",""),
	Ounce ("oz","28.35g"), Pound("lb","453.59g"), Tonne("T","1000000g");

	private final String abv;
	private final String detail;

	Weight(String abv, String detail) {
		this.abv = abv;
		this.detail = detail;
	}

	public static Optional<Weight> getWeightByAbv(String abv) {
		return Arrays.stream(Weight.values())
				.filter(t -> t.abv.equalsIgnoreCase(abv))
				.findFirst();
	}


	public String getDescription(){
		return abv + " " +detail;
	}


}
