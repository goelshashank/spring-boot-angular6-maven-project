package com.chefstory.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Version;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Getter @Setter @MappedSuperclass public abstract class BaseEntity implements Serializable {

	@CreationTimestamp @Temporal(value = TemporalType.TIMESTAMP) @Column(name = "created_ts", updatable = false) private Date createdTs;

	@UpdateTimestamp @Column(name = "modified_ts") @Temporal(value = TemporalType.TIMESTAMP) private Date modifiedTs;

	@Version @Column(name = "version") @JsonIgnore private Long version;

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer id;

}
