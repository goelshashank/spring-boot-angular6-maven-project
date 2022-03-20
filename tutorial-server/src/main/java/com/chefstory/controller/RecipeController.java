/**
 *
 */
package com.chefstory.controller;

import com.chefstory.entity.*;
import com.chefstory.entity.pojo.Unit;
import com.chefstory.model.AddIngredient;
import com.chefstory.model.AddRecipe;
import com.chefstory.model.GetConfigResponse;
import com.chefstory.repository.*;
import com.chefstory.service.FileServiceUtils;
import com.chefstory.service.RecipeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

import static com.chefstory.utils.Constants.ADD;
import static com.chefstory.utils.Constants.UPDATE;

@RestController
@RequestMapping(path = "/chefstory", produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
@Validated
public class RecipeController {


	@Autowired
	private RecipeRepo recipeRepo;
	@Autowired
	private IngredientRepo ingredientRepo;
	@Autowired
	private FileServiceUtils fileServiceUtils;
	@Autowired
	private SupplierRepo supplierRepo;
	@Autowired
	BrandRepo brandRepo;
	@Autowired
	RecipeService recipeService;
	@Autowired
	CategoryRepo categoryRepo;

	@GetMapping("/getAllRecipes")
	public ResponseEntity<List<Recipe>> getAllRecipes() {
		List<Recipe> recipes = recipeRepo.findAll();
		return new ResponseEntity<>(recipes, HttpStatus.OK);
	}

	@GetMapping("/getAllCategories")
	public ResponseEntity<List<Category>> getAllCategories() {
		List<Category> categories = categoryRepo.findAll();
		return new ResponseEntity<>(categories, HttpStatus.OK);
	}
	@GetMapping("/getAllIngredients")
	public ResponseEntity<List<Ingredient>> getAllIngredients() {
		List<Ingredient> ingredients = ingredientRepo.findAll();
		return new ResponseEntity<>(ingredients, HttpStatus.OK);
	}
	@GetMapping("/getAllBrands")
	public ResponseEntity<List<Brand>> getAllBrands() {
		List<Brand> brands = brandRepo.findAll();
		return new ResponseEntity<>(brands, HttpStatus.OK);
	}

	@GetMapping("/getAllSuppliers")
	public ResponseEntity<List<Supplier>> getAllSuppliers() {
		List<Supplier> suppliers = supplierRepo.findAll();
		return new ResponseEntity<>(suppliers, HttpStatus.OK);
	}

	@PostMapping("/getRecipes")
	public ResponseEntity<Collection<Recipe>> getRecipes(@RequestBody List<Recipe> recipes) {
		Map<Long,Recipe> recipeMap=new HashMap<>();
		recipes.stream().forEach(t-> {
			recipeMap.put(t.getId(),recipeRepo.findById(t.getId()));
		});
		return new ResponseEntity<>(recipeMap.values(), HttpStatus.OK);
	}

	@PostMapping("/getIngredients")
	public ResponseEntity<Collection<Ingredient>> getIngredients(@RequestBody List<Ingredient> ingredients) {
		Map<Long,Ingredient> ingredientMap=new HashMap<>();
		ingredients.stream().forEach(t-> {
			ingredientMap.put(t.getId(),ingredientRepo.findById(t.getId()));
		});
		return new ResponseEntity<>(ingredientMap.values(), HttpStatus.OK);
	}

	@PostMapping("/getBrands")
	public ResponseEntity<Map<Long,Brand>> getBrands(@RequestBody List<Brand> Brands) {
		Map<Long,Brand> brandMap=new HashMap<>();
		Brands.stream().forEach(t-> {
			brandMap.put(t.getId(),brandRepo.findById(t.getId()));
		});
		return new ResponseEntity<>(brandMap, HttpStatus.OK);
	}

	@PostMapping("/getCategories")
	public ResponseEntity<Map<String,List<Category>>> getCategories(@RequestBody List<Category> categories) {
		Map<String,List<Category>> categoryMap=new HashMap<>();
		categories.stream().forEach(t-> {
			categoryMap.put(t.getType(),categoryRepo.findByType(t.getType()));
		});
		return new ResponseEntity<>(categoryMap, HttpStatus.OK);
	}


	@PostMapping("/getSuppliers")
	public ResponseEntity<Map<Long,Supplier>> getSuppliers(@RequestBody List<Supplier> Suppliers) {
		Map<Long,Supplier> supplierMap=new HashMap<>();
		Suppliers.stream().forEach(t-> {
			supplierMap.put(t.getId(),supplierRepo.findById(t.getId()));
		});
		return new ResponseEntity<>(supplierMap, HttpStatus.OK);
	}

	@GetMapping("/getConfig")
	@Cacheable
	public ResponseEntity<GetConfigResponse> getConfig() {
		GetConfigResponse getConfigResponse = new GetConfigResponse();
		getConfigResponse.setUnitsDetailed(Unit.values());
		getConfigResponse.setUnits(Unit.values().values().stream()
				.flatMap(List::stream).collect(Collectors.toList()));
		return new ResponseEntity<>(getConfigResponse, HttpStatus.OK);
	}

	@PostMapping("/updateRecipes/{action}")
	public ResponseEntity updateRecipes(@Valid @RequestBody List<AddRecipe> addRecipeList,@PathVariable(name="action",required
			=true)String action) {

		if(ADD.equalsIgnoreCase(action)) {
			recipeService.addRecipe(addRecipeList);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}


	@PostMapping("/updateIngredients/{action}")
	public ResponseEntity updateIngredients(@Valid @RequestBody List<AddIngredient> addIngredients,@PathVariable(name="action",required
			=true)String action) {

		if(ADD.equalsIgnoreCase(action)) {
			recipeService.addIngredient(addIngredients);
		}else if(UPDATE.equalsIgnoreCase(action)){
			//recipeService.updateIngredient(addIngredients);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/updateSuppliers/{action}")
	public ResponseEntity updateSuppliers(@Valid @RequestBody List<Supplier> suppliers,@PathVariable(name="action",required
			=true)String action) {
		supplierRepo.saveAll(suppliers);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/updateBrands/{action}")
	public ResponseEntity updateBrands(@Valid @RequestBody List<Brand> brands,@PathVariable(name="action",required
			=true)String action) {
		brandRepo.saveAll(brands);
		return new ResponseEntity<>(HttpStatus.OK);
	}


	@PostMapping("/upload")
	public ResponseEntity uploadFile(@RequestParam("file") MultipartFile file) {
		fileServiceUtils.save(file);
		return ResponseEntity.status(HttpStatus.OK).build();
	}

}
