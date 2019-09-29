package io.landzcape.util

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test

class GlobMatcherTest {

    @Test
    fun validSuffixMatching() {
        val globMatcher = GlobMatcher("*-suffix")
        assertThat(globMatcher.matches("hello-suffix")).isTrue()
    }

    @Test
    fun validPrefixMatching() {
        val globMatcher = GlobMatcher("prefix-*")
        assertThat(globMatcher.matches("prefix-hello")).isTrue()
    }

    @Test
    fun invalidSuffixMatching() {
        val globMatcher = GlobMatcher("*-suffix")
        assertThat(globMatcher.matches("hello-suffix.")).isFalse()
    }

    @Test
    fun validEverythingMatcher() {
        val globMatcher = GlobMatcher("*")
        assertThat(globMatcher.matches("helloblabla*asdfj/\\")).isTrue()
    }

    @Test
    fun validSingleCharacterReplaced() {
        val globMatcher = GlobMatcher("a?c")
        assertThat(globMatcher.matches("abc")).isTrue()
    }

    @Test
    fun validMultipleCharacterReplaced() {
        val globMatcher = GlobMatcher("a??c")
        assertThat(globMatcher.matches("abac")).isTrue()
    }


    @Test
    fun inavlidNullPatternWithString() {
        val globMatcher = GlobMatcher(null)
        assertThat(globMatcher.matches("abac")).isFalse()
    }


    @Test
    fun inavlidNullPatternWithNullInput() {
        val globMatcher = GlobMatcher(null)
        assertThat(globMatcher.matches(null)).isFalse()
    }
}