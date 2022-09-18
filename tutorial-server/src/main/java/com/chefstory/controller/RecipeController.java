/**
 *
 */
package com.chefstory.controller;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Brand;
import com.chefstory.entity.Category;
import com.chefstory.entity.Ingredient;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.Supplier;
import com.chefstory.entity.pojo.Status;
import com.chefstory.entity.pojo.Unit;
import com.chefstory.model.AddIngredient;
import com.chefstory.model.AddRecipe;
import com.chefstory.model.GetConfigResponse;
import com.chefstory.repository.BrandRepo;
import com.chefstory.repository.CategoryRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.RecipeRepo;
import com.chefstory.repository.SupplierRepo;
import com.chefstory.service.KitchenService;
import com.chefstory.utils.FileUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.chefstory.utils.Constants.ADD;
import static com.chefstory.utils.Constants.REMOVE;
import static com.chefstory.utils.Constants.UPDATE;

@RestController @RequestMapping(path = "/chefstory", produces = MediaType.APPLICATION_JSON_VALUE) @Slf4j @Validated public class RecipeController {

	@Autowired BrandRepo brandRepo;
	@Autowired KitchenService kitchenService;
	@Autowired CategoryRepo categoryRepo;
	@Autowired private RecipeRepo recipeRepo;
	@Autowired private IngredientRepo ingredientRepo;
	@Autowired private FileUtils fileUtils;
	@Autowired private SupplierRepo supplierRepo;

	@GetMapping("/getAllRecipes") public ResponseEntity<List<Recipe>> getAllRecipes() {
		return new ResponseEntity<>(
				recipeRepo.findAll().stream().filter(t -> t.getStatus().equals(Status.ACTIVE)).collect(Collectors.toList()),
				HttpStatus.OK);
	}

	@GetMapping("/getAllCategories") public ResponseEntity<List<Category>> getAllCategories() {
		return new ResponseEntity<>(
				categoryRepo.findAll().stream().filter(t -> t.getStatus().equals(Status.ACTIVE)).collect(Collectors.toList()),
				HttpStatus.OK);
	}

	@GetMapping("/getAllIngredients") public ResponseEntity<List<Ingredient>> getAllIngredients() {
		return new ResponseEntity<>(
				ingredientRepo.findAll().stream().filter(t -> t.getStatus().equals(Status.ACTIVE)).collect(Collectors.toList()),
				HttpStatus.OK);
	}

	@GetMapping("/getAllBrands") public ResponseEntity<List<Brand>> getAllBrands() {
		return new ResponseEntity<>(
				brandRepo.findAll().stream().filter(t -> t.getStatus().equals(Status.ACTIVE)).collect(Collectors.toList()),
				HttpStatus.OK);
	}

	@GetMapping("/getAllSuppliers") public ResponseEntity<List<Supplier>> getAllSuppliers() {
		return new ResponseEntity<>(
				supplierRepo.findAll().stream().filter(t -> t.getStatus().equals(Status.ACTIVE)).collect(Collectors.toList()),
				HttpStatus.OK);
	}

	@PostMapping("/getRecipes") public ResponseEntity<Collection<Recipe>> getRecipes(@RequestBody List<Recipe> recipes) {
		return new ResponseEntity<>(
				recipes.stream().collect(Collectors.toMap(BaseEntity::getId, t -> recipeRepo.findById(t.getId()))).values(),
				HttpStatus.OK);
	}

	@PostMapping("/getIngredients") public ResponseEntity<Collection<Ingredient>> getIngredients(
			@RequestBody List<Ingredient> ingredients) {
		return new ResponseEntity<>(
				ingredients.stream().collect(Collectors.toMap(BaseEntity::getId, t -> ingredientRepo.findById(t.getId()))).values(),
				HttpStatus.OK);
	}

	@PostMapping("/getBrands") public ResponseEntity<Map<Long, Brand>> getBrands(@RequestBody List<Brand> brands) {
		return new ResponseEntity<>(brands.stream().collect(Collectors.toMap(BaseEntity::getId, t -> brandRepo.findById(t.getId()))),
				HttpStatus.OK);
	}

	@PostMapping("/getCategories") public ResponseEntity<Map<String, List<Category>>> getCategories(
			@RequestBody List<Category> categories) {
		return new ResponseEntity<>(
				categories.stream().collect(Collectors.toMap(Category::getType, t -> categoryRepo.findByType(t.getType()))),
				HttpStatus.OK);
	}

	@PostMapping("/getSuppliers") public ResponseEntity<Map<Long, Supplier>> getSuppliers(@RequestBody List<Supplier> suppliers) {
		return new ResponseEntity<>(
				suppliers.stream().collect(Collectors.toMap(BaseEntity::getId, t -> supplierRepo.findById(t.getId()))), HttpStatus.OK);
	}

	@GetMapping("/getConfig") @Cacheable public ResponseEntity<GetConfigResponse> getConfig() {
		GetConfigResponse getConfigResponse = new GetConfigResponse();
		getConfigResponse.setUnitsDetailed(Unit.values());
		getConfigResponse.setUnits(Unit.values().values().stream().flatMap(List::stream).collect(Collectors.toList()));
		return new ResponseEntity<>(getConfigResponse, HttpStatus.OK);
	}

	@PostMapping("/updateRecipes/{action}")  @Transactional public ResponseEntity<HttpStatus> updateRecipes(
			@Valid @RequestBody List<AddRecipe> addRecipeList, @PathVariable(name = "action", required = true) String action) {

		if (ADD.equalsIgnoreCase(action))
			kitchenService.addRecipe(addRecipeList);
		else if (UPDATE.equalsIgnoreCase(action))
			kitchenService.updateRecipe(addRecipeList);
		else if (REMOVE.equalsIgnoreCase(action))
			kitchenService.removeRecipe(addRecipeList);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/updateIngredients/{action}") @Transactional public ResponseEntity<HttpStatus> updateIngredients(
			@Valid @RequestBody List<AddIngredient> addIngredients, @PathVariable(name = "action", required = true) String action) {
		if (ADD.equalsIgnoreCase(action))
			kitchenService.addIngredient(addIngredients);
		else if (UPDATE.equalsIgnoreCase(action))
			kitchenService.updateIngredient(addIngredients);
		else if (REMOVE.equalsIgnoreCase(action))
			kitchenService.removeIngredient(addIngredients);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/updateSuppliers/{action}") @Transactional public ResponseEntity<HttpStatus> updateSuppliers(
			@Valid @RequestBody List<Supplier> suppliers, @PathVariable(name = "action", required = true) String action) {
		if (ADD.equalsIgnoreCase(action) || UPDATE.equalsIgnoreCase(action))
			supplierRepo.saveAll(suppliers);
		else if (REMOVE.equalsIgnoreCase(action)) {
			supplierRepo.saveAll(suppliers.stream().map(t -> {
				t.setStatus(Status.INACTIVE);
				return t;
			}).collect(Collectors.toList()));
		}
		return new ResponseEntity<>(HttpStatus.OK);

	}

	@PostMapping("/updateBrands/{action}") public ResponseEntity<HttpStatus> updateBrands(@Valid @RequestBody List<Brand> brands,
			@PathVariable(name = "action", required = true) String action) {

		if (ADD.equalsIgnoreCase(action) || UPDATE.equalsIgnoreCase(action))
			brandRepo.saveAll(brands);
		else if (REMOVE.equalsIgnoreCase(action)) {
			brandRepo.saveAll(brands.stream().map(t -> {
				t.setStatus(Status.INACTIVE);
				return t;
			}).collect(Collectors.toList()));
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/upload") public ResponseEntity<HttpStatus> uploadFile(@RequestParam("file") MultipartFile file) {
		fileUtils.save(file);
		return ResponseEntity.status(HttpStatus.OK).build();
	}


	@GetMapping("/test") public void testIt() {
		log.info("start");

		log.info("stop");
	}


}
