package com.chefstory.entity;

import com.chefstory.entity.pojo.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data @MappedSuperclass public abstract class BaseEntity implements Serializable, Cloneable {

	@CreationTimestamp @Temporal(value = TemporalType.TIMESTAMP) @Column(name = "created_ts", updatable = false) @JsonIgnore private Date createdTs;

	@UpdateTimestamp @Column(name = "modified_ts") @Temporal(value = TemporalType.TIMESTAMP) private Date modifiedTs;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;

	@Column(name = "status") @Enumerated(EnumType.STRING) private Status status = Status.ACTIVE;

}
