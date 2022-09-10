package com.chefstory.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "supplier")
@Table(uniqueConstraints =
        { @UniqueConstraint(name = "UniqueTitleAndStatus", columnNames = {
                "title", "status" }) })
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class Supplier extends BaseEntity {

    @Column(name = "title", nullable = false)
    @NotBlank
    private String title;

}
