package com.chefstory.repository;

import com.chefstory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository public interface CategoryRepo extends JpaRepository<Category, Integer> {

	List<Category> findByTitle(String title);

	Category findById(Long id);

	List<Category> findByType(String type);

	List<Category> findByTitleAndType(String title, String type);

}
