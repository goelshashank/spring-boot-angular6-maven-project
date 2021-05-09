package com.chefstory.repository;

import com.chefstory.entity.Receipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Repository
public interface ReceipeRepo extends JpaRepository<Receipe, Integer> {

	public List<Receipe> findByTitle(String title);
}
