/**
 *
 */
package com.chefstory.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.chefstory.entity.Brand;
import com.chefstory.entity.BrandForIngredient;
import com.chefstory.entity.Supplier;
import com.chefstory.entity.SupplierForIngredient;
import com.chefstory.model.AddIngredient;
import com.chefstory.model.AddRecipe;
import com.chefstory.repository.BrandForIngredientRepo;
import com.chefstory.repository.BrandRepo;
import com.chefstory.repository.SupplierForIngredientRepo;
import com.chefstory.repository.SupplierRepo;
import com.chefstory.service.FileServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.chefstory.entity.Ingredient;
import com.chefstory.entity.IngredientInRecipe;
import com.chefstory.entity.Recipe;
import com.chefstory.entity.Unit;
import com.chefstory.model.GetConfigResponse;
import com.chefstory.repository.IngredientInRecipeRepo;
import com.chefstory.repository.IngredientRepo;
import com.chefstory.repository.RecipeRepo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "/chefstory", produces = MediaType.APPLICATION_JSON_VALUE)
@Slf4j
@Validated
public class RecipeController {

	private static final String DEFAULT="default";
	private static final String ADD="add";
	private static final String UPDATE="update";
	private static final String REMOVE="remove";

	@Autowired
	private RecipeRepo recipeRepo;
	@Autowired
	private IngredientInRecipeRepo ingredientInRecipeRepo;
	@Autowired
	private IngredientRepo ingredientRepo;
	@Autowired
	private FileServiceUtils fileServiceUtils;
	@Autowired
	private SupplierRepo supplierRepo;
	@Autowired
	private SupplierForIngredientRepo supplierForIngredientRepo;
	@Autowired
	BrandForIngredientRepo brandForIngredientRepo;
	@Autowired
	BrandRepo brandRepo;

	private Supplier defaultSupplier;
	private Brand defaultBrand;

	@PostConstruct
	public void init(){
		defaultSupplier=CollectionUtils.isEmpty(supplierRepo.findByTitle(DEFAULT))?supplierRepo.save(new Supplier().setTitle(DEFAULT)):
				supplierRepo.findByTitle(DEFAULT).get(0);
		defaultBrand=CollectionUtils.isEmpty(brandRepo.findByTitle(DEFAULT))?brandRepo.save(new Brand().setTitle(DEFAULT)):
				brandRepo.findByTitle(DEFAULT).get(0);
	}

	@GetMapping("/getAllRecipes")
	public ResponseEntity<List<Recipe>> getAllRecipes() {
		List<Recipe> recipes = recipeRepo.findAll();/*.stream().map(t -> {
			Recipe recp = new Recipe();
			recp.setId(t.getId());
			recp.setTitle(t.getTitle());
			return recp;
		}).collect(Collectors.toList());*/
		return new ResponseEntity<>(recipes, HttpStatus.OK);
	}

	@GetMapping("/getAllIngredients")
	public ResponseEntity<List<Ingredient>> getAllIngredients() {
		List<Ingredient> ingredients = ingredientRepo.findAll();/*.stream().map(t -> {
			Ingredient ing = new Ingredient();
			ing.setId(t.getId());
			ing.setTitle(t.getTitle());
			return ing;
		}).collect(Collectors.toList());*/
		return new ResponseEntity<>(ingredients, HttpStatus.OK);
	}

	@GetMapping("/getAllBrands")
	public ResponseEntity<List<Brand>> getAllBrands() {
		List<Brand> brands = brandRepo.findAll();/*.stream().map(t -> {
			Recipe recp = new Recipe();
			recp.setId(t.getId());
			recp.setTitle(t.getTitle());
			return recp;
		}).collect(Collectors.toList());*/
		return new ResponseEntity<>(brands, HttpStatus.OK);
	}

	@GetMapping("/getAllSuppliers")
	public ResponseEntity<List<Supplier>> getAllSuppliers() {
		List<Supplier> suppliers = supplierRepo.findAll();/*.stream().map(t -> {
			Ingredient ing = new Ingredient();
			ing.setId(t.getId());
			ing.setTitle(t.getTitle());
			return ing;
		}).collect(Collectors.toList());*/
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
	public ResponseEntity updateRecipes(@Valid @RequestBody List<AddRecipe> addRecipeList) {

		List<Recipe> recipes=new ArrayList<>();
		addRecipeList.forEach(t->{
			if(CollectionUtils.isEmpty(t.getAddIngredients()))
				return;

			Recipe recipe=t.getRecipe();

			List<IngredientInRecipe> ingredientInRecipes=
					t.getAddIngredients().stream().map(u->{
						Supplier supplier=CollectionUtils.isEmpty(u.getAddSuppliers())?defaultSupplier:u.getAddSuppliers().get(0).getSupplier();
						Brand brand=CollectionUtils.isEmpty(u.getAddBrands())?defaultBrand:u.getAddBrands().get(0).getBrand();
						IngredientInRecipe ingredientInRecipe= new IngredientInRecipe()
							.setRecipe(recipe).setIngredient(u.getIngredient())
							.setSupplier(supplier).setBrand(brand);
					return ingredientInRecipe;
					}).collect(Collectors.toList());
			recipe.setIngredientInRecipe(ingredientInRecipes);

			recipes.add(recipe);
		});
		recipeRepo.saveAll(recipes);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/updateIngredients/{action}")
	public ResponseEntity updateIngredients(@Valid @RequestBody List<AddIngredient> addIngredients,@PathVariable(name="action",required
			=true)String action) {

		if(ADD.equalsIgnoreCase(action)) {
			List<Ingredient> list = new ArrayList<>();
			addIngredients.forEach(t -> {
				Ingredient ingredient = t.getIngredient().setBrandForIngredients(addBrands(t, t.getIngredient()))
						.setSupplierForIngredients(addSupplier(t, t.getIngredient()));
				list.add(ingredient);
			});
			ingredientRepo.saveAll(list);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	private List<SupplierForIngredient> addSupplier(AddIngredient t, Ingredient ingredient) {
		List<SupplierForIngredient> supplierForIngredients;
		if(CollectionUtils.isEmpty(t.getAddSuppliers())){
			supplierForIngredients= Arrays.asList(new SupplierForIngredient()
					.setIngredient(ingredient).setSupplier((
							CollectionUtils.isEmpty(t.getAddSuppliers())?defaultSupplier:
			t.getAddSuppliers().get(0).getSupplier())));
		}
		else {
			supplierForIngredients=	t.getAddSuppliers().stream()
					.map(u -> new SupplierForIngredient().setIngredient(ingredient)
							.setSupplier(u.getSupplier())).collect(Collectors.toList());
		}
		return  supplierForIngredients;
	}

	private List<BrandForIngredient> addBrands(AddIngredient t, Ingredient ingredient) {
		List<BrandForIngredient> brandForIngredients;
		if(CollectionUtils.isEmpty(t.getAddBrands())){
			brandForIngredients= Arrays.asList(new BrandForIngredient()
					.setIngredient(ingredient).setBrand((
							CollectionUtils.isEmpty(t.getAddBrands())?defaultBrand:
									t.getAddBrands().get(0).getBrand())));
		}
		else {
			brandForIngredients=	t.getAddBrands().stream()
					.map(u -> new BrandForIngredient().setIngredient(ingredient)
							.setBrand(u.getBrand())).collect(Collectors.toList());
		}
		return brandForIngredients;
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
