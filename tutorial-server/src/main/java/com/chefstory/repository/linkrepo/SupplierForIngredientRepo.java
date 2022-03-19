package com.chefstory.repository.linkrepo;

import com.chefstory.entity.linkent.SupplierForIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface SupplierForIngredientRepo extends JpaRepository<SupplierForIngredient, Integer> {

}
