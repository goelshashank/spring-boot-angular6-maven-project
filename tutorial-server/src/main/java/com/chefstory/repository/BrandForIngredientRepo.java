package com.chefstory.repository;

import com.chefstory.entity.BrandForIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chefstory.entity.SupplierForIngredient;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface BrandForIngredientRepo extends JpaRepository<BrandForIngredient, Integer> {


	public List<BrandForIngredientRepo> findByIngredientIdAndBrandId(Long ingId,Long brandId);

}
