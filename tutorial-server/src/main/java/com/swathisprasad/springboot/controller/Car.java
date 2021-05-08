package com.swathisprasad.springboot.controller;

import java.io.Serializable;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 08/05/21
 */

public class Car implements Serializable {

	private Long id;
	private String name;

	public Car(Long id, String name) {
		this.id = id;
		this.name = name;
	}

	public Car (){

	}

	public Long getId() {
		return id;
	}

	public Car setId(Long id) {
		this.id = id;
		return this;
	}

	public String getName() {
		return name;
	}

	public Car setName(String name) {
		this.name = name;
		return this;
	}
}
