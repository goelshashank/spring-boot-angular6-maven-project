/**
 *
 */
package com.chefstory;

import com.chefstory.entity.Recipe;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.util.StopWatch;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Shashank Goel
 *
 */
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

	public static void main(String[] args) throws Exception {

		test();

		SpringApplication.run(Application.class, args);
	}

	static void  test() throws Exception{
		Map<String,String> map=new HashMap<>();

		String est=map.get("test");

		PodamFactory factory = new PodamFactoryImpl();

		// This will use constructor with minimum arguments and
		// then setters to populate POJO
		Recipe myPojo = factory.manufacturePojo(Recipe.class);
		myPojo.setIngredientInRecipe(null);
		String str=new Gson().toJson(myPojo);
		StopWatch stopWatch=new StopWatch();
		stopWatch.start();
		ObjectMapper obj=new ObjectMapper();
		Recipe rec=obj.readValue(str,Recipe.class);
		stopWatch.stop();
		System.out.println("--"+stopWatch.getTotalTimeMillis());
		stopWatch=new StopWatch();
		stopWatch.start();
		rec=new Gson().fromJson(str, Recipe.class);
		rec=obj.readValue(str,Recipe.class);
		stopWatch.stop();
		System.out.println("---"+stopWatch.getTotalTimeMillis());
		stopWatch=new StopWatch();
		stopWatch.start();
		String str1=rec.toString();
		stopWatch.stop();
		System.out.println("----"+stopWatch.getLastTaskTimeNanos());
		System.out.println("");
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedMethods("GET", "POST", "PUT", "DELETE").allowedOrigins("*")
						.allowedHeaders("*");
			}
		};
	}

	@Bean
	public CommonsRequestLoggingFilter requestLoggingFilter() {
		CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
		loggingFilter.setIncludeClientInfo(true);
		loggingFilter.setIncludeQueryString(true);
		loggingFilter.setIncludePayload(true);
		loggingFilter.setIncludeHeaders(false);
		return loggingFilter;
	}

}
