package com.chefstory.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chefstory.entity.IngredientInRecipe;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface IngredientInRecipeRepo extends JpaRepository<IngredientInRecipe, Integer> {
/*
	@Modifying
	@Query(value = "insert into ingredient_in_recipe (recipe_id,ingredient_id,recipe_id) VALUES (:recipe_id,:ingredient_id,:recipe_id)", nativeQuery = true)
	@Transactional
	int insert(@Param("recipe_id") Long recipeId, @Param("ingredient_id") Long ingredientCompId,
			@Param("recipe_id") Long recipeCompId);*/

}
