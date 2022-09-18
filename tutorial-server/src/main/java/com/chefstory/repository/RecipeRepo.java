package com.chefstory.repository;

import com.chefstory.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository public interface RecipeRepo extends JpaRepository<Recipe, Integer> {

	List<Recipe> findByTitle(String title);

	Recipe findById(Long id);

}
