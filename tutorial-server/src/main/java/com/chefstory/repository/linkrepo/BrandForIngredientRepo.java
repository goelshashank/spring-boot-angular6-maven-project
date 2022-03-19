package com.chefstory.repository.linkrepo;

import com.chefstory.entity.linkent.BrandForIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
