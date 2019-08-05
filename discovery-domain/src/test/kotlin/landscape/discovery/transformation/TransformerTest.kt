package io.landzcape.discovery.transformation

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test

class TransformerTest {

    @Test
    fun givenACamelCaseString_whenTransformingItToKebabCase_thenItIsTransformedCorrectly() {
        val transformer = Transformer("camel-to-kebab")
        assertThat(transformer.transform("HelloWorld")).isEqualTo("hello-world")
        assertThat(transformer.transform("helloWorld")).isEqualTo("hello-world")
        assertThat(transformer.transform("helloworld")).isEqualTo("helloworld")
        assertThat(transformer.transform("_hello!World")).isEqualTo("_hello!-world")
    }

    @Test
    fun givenACamelCaseString_whenTransformingItToSnake_thenItIsTransformedCorrectly() {
        val transformer = Transformer("camel-to-snake")
        assertThat(transformer.transform("HelloWorld")).isEqualTo("hello_world")
        assertThat(transformer.transform("helloWorld")).isEqualTo("hello_world")
        assertThat(transformer.transform("helloworld")).isEqualTo("helloworld")
        assertThat(transformer.transform("_hello!World")).isEqualTo("_hello!_world")
    }

    @Test
    fun givenASnakeCaseString_whenTransformingItToCamel_thenItIsTransformedCorrectly() {
        val transformer = Transformer("snake-to-camel")
        assertThat(transformer.transform("hello_world")).isEqualTo("HelloWorld")
        assertThat(transformer.transform("hello_World")).isEqualTo("HelloWorld")
        assertThat(transformer.transform("helloworld")).isEqualTo("Helloworld")
        assertThat(transformer.transform("_hello!_World")).isEqualTo("Hello!World")
    }

    @Test
    fun givenASnakeCaseString_whenTransformingItToKebab_thenItIsTransformedCorrectly() {
        val transformer = Transformer("snake-to-kebab")
        assertThat(transformer.transform("hello_world")).isEqualTo("hello-world")
        assertThat(transformer.transform("hello_World")).isEqualTo("hello-world")
        assertThat(transformer.transform("helloworld")).isEqualTo("helloworld")
        assertThat(transformer.transform("_hello!_World")).isEqualTo("hello!-world")
    }

    @Test
    fun givenAKebabCaseString_whenTransformingItToCamel_thenItIsTransformedCorrectly() {
        val transformer = Transformer("kebab-to-camel")
        assertThat(transformer.transform("hello-world")).isEqualTo("HelloWorld")
        assertThat(transformer.transform("hello-World")).isEqualTo("HelloWorld")
        assertThat(transformer.transform("helloworld")).isEqualTo("Helloworld")
        assertThat(transformer.transform("_hello!-World")).isEqualTo("_hello!World")
    }

    @Test
    fun givenAKebabCaseString_whenTransformingItToSnake_thenItIsTransformedCorrectly() {
        val transformer = Transformer("kebab-to-snake")
        assertThat(transformer.transform("hello-world")).isEqualTo("hello_world")
        assertThat(transformer.transform("hello-World")).isEqualTo("hello_world")
        assertThat(transformer.transform("helloworld")).isEqualTo("helloworld")
        assertThat(transformer.transform("_hello!-World")).isEqualTo("_hello!_world")
    }

    @Test
    fun givenAKebabCaseString_whenTransformingItToCapital_thenItIsTransformedCorrectly() {
        val transformer = Transformer("kebab-to-capital")
        assertThat(transformer.transform("hello-wOrld")).isEqualTo("Hello WOrld")
        assertThat(transformer.transform("hello-World")).isEqualTo("Hello World")
        assertThat(transformer.transform("helloworld")).isEqualTo("Helloworld")
        assertThat(transformer.transform("_hello!-World")).isEqualTo("_hello! World")
    }

    @Test
    fun givenAnyCaseString_whenTransformingItToCapital_thenItIsTransformedCorrectly() {
        val transformer = Transformer("any-to-capital")
        assertThat(transformer.transform("hello_world")).isEqualTo("Hello World")
        assertThat(transformer.transform("Hello-World")).isEqualTo("Hello World")
        assertThat(transformer.transform("hello-world")).isEqualTo("Hello World")
        assertThat(transformer.transform("HelloWorld")).isEqualTo("Hello World")
        assertThat(transformer.transform("how_are_you")).isEqualTo("How Are You")
        assertThat(transformer.transform("i_love_APIs")).isEqualTo("I Love APIs")
    }

}