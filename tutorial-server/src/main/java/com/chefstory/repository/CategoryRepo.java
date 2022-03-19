package com.chefstory.repository;

import com.chefstory.entity.Brand;
import com.chefstory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {

	public List<Category> findByTitle(String title);

	public Category findById(Long id);

	public List<Category> findByType(String type);

	public List<Category> findByTitleAndType(String title,String type);

}
