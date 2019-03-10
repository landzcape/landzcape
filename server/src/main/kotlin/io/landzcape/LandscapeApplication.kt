package io.landzcape

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class LandscapeApplication {


}

fun main(args: Array<String>) {
    SpringApplication.run(LandscapeApplication::class.java, *args)
}