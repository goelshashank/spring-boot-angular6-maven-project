/**
 * 
 */
package com.swathisprasad.springboot.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collection;

/**
 * @author Swathi
 *
 */
@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class HomeController {
	
	@GetMapping("/home")
	public String home() {
		return "forward:/index.html";
	}

	@GetMapping("/hi")
	public ResponseEntity<String> getHi() {
		System.out.println("hi printed");

		return new ResponseEntity<>("hh", HttpStatus.OK);
	}

	@GetMapping("/cool-cars")
	public Collection<Car> coolCars() {
		System.out.println("sssssssssssssssss");
		Car car=new Car(123L,"test");
		Car car1=new Car(124L,"test1");

		return Arrays.asList(car,car1);

	}

}
