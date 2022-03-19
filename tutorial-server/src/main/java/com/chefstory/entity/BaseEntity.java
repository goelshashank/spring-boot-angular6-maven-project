package com.chefstory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

	@CreationTimestamp
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name = "created_ts", updatable = false)
	@JsonIgnore
	private Date createdTs;

	@UpdateTimestamp
	@Column(name = "modified_ts")
	@Temporal(value = TemporalType.TIMESTAMP)
	@JsonIgnore
	private Date modifiedTs;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

}
