package com.chefstory.login.controller;

import com.chefstory.login.config.CurrentUser;
import com.chefstory.login.dto.LocalUser;
import com.chefstory.login.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chefstory")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAll(@CurrentUser LocalUser user) {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
