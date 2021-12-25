package com.chefstory.repository;

import java.util.List;

import com.chefstory.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chefstory.entity.Supplier;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface BrandRepo extends JpaRepository<Brand, Integer> {

	public List<Brand> findByTitle(String title);

	public Brand findById(Long id);
}
