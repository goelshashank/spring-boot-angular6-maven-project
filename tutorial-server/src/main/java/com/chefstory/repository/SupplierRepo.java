package com.chefstory.repository;

import java.util.List;

import com.chefstory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface SupplierRepo extends JpaRepository<Supplier, Integer> {

	public List<Supplier> findByTitle(String title);

	public Supplier findById(Long id);
}
