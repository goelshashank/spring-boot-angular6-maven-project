package com.chefstory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chefstory.entity.Ingredient;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface IngredientRepo extends JpaRepository<Ingredient, Integer> {

	public Ingredient findByTitle(String title);
}
