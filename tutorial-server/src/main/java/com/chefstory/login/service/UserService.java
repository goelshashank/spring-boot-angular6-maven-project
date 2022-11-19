package com.chefstory.login.service;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;

import com.chefstory.login.dto.LocalUser;
import com.chefstory.login.dto.SignUpRequest;
import com.chefstory.login.exception.UserAlreadyExistAuthenticationException;
import com.chefstory.login.model.User;

/**
 * @author Chinna
 * @since 26/3/18
 */
public interface UserService {

	public User registerNewUser(SignUpRequest signUpRequest) throws UserAlreadyExistAuthenticationException;

	User findUserByEmail(String email);

	Optional<User> findUserById(Long id);

	LocalUser processUserRegistration(String registrationId, Map<String, Object> attributes, OidcIdToken idToken, OidcUserInfo userInfo);
}
