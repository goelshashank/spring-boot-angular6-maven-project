/**
 * 
 */
package com.chefstory.controller;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Ingredient_In_Receipe;
import com.chefstory.entity.Receipe;
import com.chefstory.model.AddIngredientToReceipe;
import com.chefstory.repository.IngredientInReceipeRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.ReceipeRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author Swathi
 *
 */
@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
public class ReceipeController {

	@Autowired
	private ReceipeRepo receipeRepo;
	@Autowired
	private IngredientInReceipeRepo ingredientInReceipeRepo;
	@Autowired
	private IngredientRepo ingredientRepo;

	@GetMapping("/test")
	public ResponseEntity<String> test() {
		return new ResponseEntity<>("test", HttpStatus.OK);
	}

	@GetMapping("/getReceipe")
	public ResponseEntity<List<Receipe>> getReceipt(@RequestBody String title) {
		List<Receipe> receipeList=receipeRepo.findByTitle(title);
		return new ResponseEntity<>(receipeList, HttpStatus.OK);
	}

	@PostMapping("/addReceipe")
	public ResponseEntity addReceipe(@RequestBody Receipe receipe) {
		receipeRepo.save(receipe);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addIngredient")
	public ResponseEntity addIngredient(@RequestBody Ingredient ingredient) {
		ingredientRepo.save(ingredient);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/addIngredientToReceipe")
	public ResponseEntity addIngredientToReceipe(@RequestBody AddIngredientToReceipe addIngredientToReceipe) {
		Ingredient_In_Receipe ingredientInReceipe=new Ingredient_In_Receipe();
		ingredientInReceipe.setReceipeId(addIngredientToReceipe.getReceipe().getId());
		ingredientInReceipe.setIngredient(addIngredientToReceipe.getIngredient());
		ingredientInReceipeRepo.save(ingredientInReceipe);
		return new ResponseEntity<>(HttpStatus.OK);

	}


}
