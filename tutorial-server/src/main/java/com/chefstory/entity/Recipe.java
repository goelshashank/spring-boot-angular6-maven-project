package com.chefstory.entity;

import com.chefstory.entity.linkent.CategoryFor;
import com.chefstory.entity.linkent.IngredientInRecipe;
import com.chefstory.entity.pojo.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "recipe")
@Table(indexes = {@Index(columnList = "title")})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Recipe extends BaseEntity {

    @Column(name = "title", nullable = false)
    @NotBlank
    private String title;
    @Column(name = "sub_category")
    private String subCategory;
    @Column(name = "course")
    private String course;
    @Column(name = "collections")
    private String collections;
    @Column(name = "source")
    private String source;
    @Column(name = "serving_qty")
    private Double servingQty;
    @Column(name = "cook_time")
    private String cookTime;
    @Column(name = "prep_time")
    private String prepTime;
    @Column(name = "rating")
    private Integer rating;
    @Column(name = "unit")
    private String unit;

    @JsonManagedReference(value = "ingredientInRecipe")
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<IngredientInRecipe> ingredientInRecipe;

    @JsonManagedReference(value = "categoriesForRecipe")
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL)
    private List<CategoryFor> categoriesForRecipe;


    @Column(name = "instructions")
    private String instructions;
    @Column(name = "shelf_life")
    private String shelfLife;
    @Column(name = "remarks")
    private String remarks;
    @Column(name = "photo_id")
    private String photoId;
    @Column(name = "video_id")
    private String videoId;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;


}
