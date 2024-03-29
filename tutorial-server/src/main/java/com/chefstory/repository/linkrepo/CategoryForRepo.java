package com.chefstory.repository.linkrepo;

import com.chefstory.entity.linkent.CategoryFor;
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
@Repository public interface CategoryForRepo extends JpaRepository<CategoryFor, Integer> {

	@Modifying @Query(value = "delete from category_for_ingredient cfi where cfi.id=?1", nativeQuery = true) void deleteById(
			Long id);

	List<CategoryForRepo> findByIngredientIdAndCategoryId(Long ingId, Long brandId);

}
