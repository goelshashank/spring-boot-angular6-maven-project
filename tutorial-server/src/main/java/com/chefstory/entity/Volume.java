package com.chefstory.entity;

import java.util.Arrays;
import java.util.Optional;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 19/12/21
 */
public enum Volume implements Unit{

	Pinch ("pinch","0.3mL"), Milliliter("mL","mL") , USTeaspoon ("tsp","4.93mL"),
	USTablespoon ("btsp","14.79mL"), FluidOnce("floz","29.57mL"), Deciliter("dL","100mL"),
	USCup ("cup","236.59mL"), Pint("pt","473.18mL"), Quart("qt","946.35mL"),
	Litre ("lt","1000mL"), Gallon("gal","3785.41mL"), CubicMeter("kL","1000000mL");

	private final String abv;
	private final String detail;

	Volume(String abv, String detail) {
		this.abv = abv;
		this.detail = detail;
	}

	public static Optional<Volume> getVolumeByAbv(String abv) {
		return Arrays.stream(Volume.values())
				.filter(t -> t.abv.equalsIgnoreCase(abv))
				.findFirst();
	}

}
