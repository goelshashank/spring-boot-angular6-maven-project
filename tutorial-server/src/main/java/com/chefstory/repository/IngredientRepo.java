package com.chefstory.repository;

import com.chefstory.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface IngredientRepo extends JpaRepository<Ingredient, Integer> {

    public List<Ingredient> findByTitle(String title);

    public Ingredient findById(Long id);



}
