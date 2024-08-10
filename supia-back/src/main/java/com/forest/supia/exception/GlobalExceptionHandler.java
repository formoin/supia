package com.forest.supia.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ExceptionResponse.class)
    public ResponseEntity<?> handlerException(ExceptionResponse e){
        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("errorCode", e.getCustomException().getErrorCode());
        errorDetails.put("erroMessage", e.getCustomException().getErrorMessage());
        ehttps://0biglife.tistory.com/entry/React-Native-%EC%84%9C%EB%B2%84-%EC%9A%94%EC%B2%AD-%EC%A0%95%EB%A6%AC-Axios-ConfigrrorDetails.put("errorMessage", e.getCustomException().getErrorMessage());
        return ResponseEntity.status(HttpStatus.valueOf(e.getCustomException().getStatusNum())).body(errorDetails);
    }
}
