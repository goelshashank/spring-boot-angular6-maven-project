package com.chefstory.repository;

import javax.transaction.Transactional;

import com.chefstory.entity.SupplierForIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chefstory.entity.IngredientInRecipe;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface SupplierForIngredientRepo extends JpaRepository<SupplierForIngredient, Integer> {

}
