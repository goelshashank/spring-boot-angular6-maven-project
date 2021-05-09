package com.chefstory.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.Set;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "ingredient")
public class Ingredient extends BaseEntity{


	@Column(name = "title")
	private String  title;

}
