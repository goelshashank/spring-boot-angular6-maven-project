package com.chefstory.repository.linkrepo;

import com.chefstory.entity.linkent.BrandForIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository public interface BrandForIngredientRepo extends JpaRepository<BrandForIngredient, Integer> {

	@Modifying @Query(value = "delete from brand_for_ingredient bfr where bfr.id=?1", nativeQuery = true) void deleteById(
			Long id);

	List<BrandForIngredientRepo> findByIngredientIdAndBrandId(Long ingId, Long brandId);

}
