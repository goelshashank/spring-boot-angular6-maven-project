drop database if exists chefstory;
create database if not exists chefstory;

DROP TABLE IF EXISTS Receipe;
CREATE TABLE if not exists Receipe (
  id INT NOT NULL AUTO_INCREMENT,
  ingredient_id int,
  CREATED_TS TIMESTAMP NOT NULL,
  updated_ts TIMESTAMP NOT NULL,
  PRIMARY KEY (id));

  DROP TABLE IF EXISTS Ingredient;
  CREATE TABLE if not exists Ingredient (
    id INT NOT NULL AUTO_INCREMENT,
    CREATED_TS TIMESTAMP NOT NULL,
    updated_ts TIMESTAMP NOT NULL,
    PRIMARY KEY (id));

    DROP TABLE IF EXISTS Ingredient_In_Receipe;
      CREATE TABLE if not exists Ingredient_In_Receipe (
        id INT NOT NULL AUTO_INCREMENT,
        CREATED_TS TIMESTAMP NOT NULL,
        updated_ts TIMESTAMP NOT NULL,
        PRIMARY KEY (id));