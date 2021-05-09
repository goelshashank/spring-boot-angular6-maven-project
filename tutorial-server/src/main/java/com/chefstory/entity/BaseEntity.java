package com.chefstory.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

	@CreationTimestamp
	@Temporal(value = TemporalType.TIMESTAMP)
	@Column(name="CREATED_TS")
	private Date createdTs;

	@UpdateTimestamp
	@Column(name="MODIFIED_TS")
	@Temporal(value = TemporalType.TIMESTAMP)
	private Date modifiedTs;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

}
