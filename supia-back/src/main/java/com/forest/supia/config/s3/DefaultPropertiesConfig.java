package com.forest.supia.config.s3;


import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class DefaultPropertiesConfig {

    @Value("${default.thumbnail}")
    private String defaultThumbnail;

    @Value("${default.profile_img}")
    private String defaultProfileImg;

    @Value("${default.bgi}")
    private String defaultBgi;


}
