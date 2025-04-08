package com.example.teamproject2025.Common.annotation;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ApiResponses(value = {
        @ApiResponse(
                responseCode = "400",
                description = "Bad Request",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Bad Request: The request is invalid.",
          "status": 400,
          "data": null
        }
        """))
        ),
        @ApiResponse(
                responseCode = "401",
                description = "Unauthorized",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Unauthorized: Authentication is required.",
          "status": 401,
          "data": null
        }
        """))
        ),
        @ApiResponse(
                responseCode = "403",
                description = "Forbidden",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Forbidden: Access to the resource is denied.",
          "status": 403,
          "data": null
        }
        """))
        ),
        @ApiResponse(
                responseCode = "404",
                description = "Not Found",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Not Found: The requested resource could not be found.",
          "status": 404,
          "data": null
        }
        """))
        ),
        @ApiResponse(
                responseCode = "409",
                description = "Conflict",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Conflict - Resource already exists",
          "status": 409,
          "data": null
        }
        """))
        ),
        @ApiResponse(
                responseCode = "413",
                description = "Payload Too Large",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Payload Too Large - The request entity is too large",
          "status": 413,
          "data": null
        }
        """))
        ),
        @ApiResponse(
                responseCode = "500",
                description = "Internal Server Error",
                content = @Content(mediaType = "application/json", schema = @Schema(example = """
        {
          "message": "Internal Server Error: An unexpected error occurred.",
          "status": 500,
          "data": null
        }
        """))
        )
})
public @interface ApiCommonErrorResponses {}
