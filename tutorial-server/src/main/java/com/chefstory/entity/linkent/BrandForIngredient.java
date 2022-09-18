package com.chefstory.entity.linkent;

import com.chefstory.entity.BaseEntity;
import com.chefstory.entity.Brand;
import com.chefstory.entity.Ingredient;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * @author Shashank Goel
 * @version 1.0
 * @since 09/05/21
 */
@Data
@Accessors(chain = true)
@Entity(name = "brand_for_ingredient")
@Table(indexes = {@Index(columnList = "ingredient_id")},
        uniqueConstraints = @UniqueConstraint(columnNames = {"ingredient_id", "brand_id"}))
@JsonInclude(JsonInclude.Include.NON_NULL)
@DynamicUpdate
public class BrandForIngredient extends BaseEntity {

    @JsonBackReference(value = "brandForIngredients")
    @ManyToOne
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "sku_cost")
    private Double skuCost;

    @Column(name = "sku_qty")
    private Double skuQty;

    @JsonProperty("perUnitCost")
    private Double getPerUnitCost() {
        if (skuCost == null || skuQty == null)
            return 0.0;

        return skuCost / skuQty;
    }

    public BrandForIngredient setIngredient(Ingredient ingredient) {
        if(StringUtils.isNotBlank(ingredient.getTitle()))
                this.ingredient = ingredient;
        return this;
    }

    public BrandForIngredient setBrand(Brand brand) {
        if(StringUtils.isNotBlank(brand.getTitle()))
              this.brand = brand;
        return this;
    }
}
