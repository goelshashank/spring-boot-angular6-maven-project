package com.chefstory.entity;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "category")
@Table(indexes = {@Index(columnList = "title,type")},
        uniqueConstraints = {@UniqueConstraint(columnNames = {"title", "type",
                "status"})})
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class Category extends BaseEntity {

    @Column(name = "title", nullable = false)
    @NotBlank
    private String title;

    @Column(name = "type", nullable = false)
    @NotBlank
    private String type;

    public Category setType(String type) {
        this.type = StringUtils.isNotBlank(type) ? type.toUpperCase() : type;
        return this;
    }
}
