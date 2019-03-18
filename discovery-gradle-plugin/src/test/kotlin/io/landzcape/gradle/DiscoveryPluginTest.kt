package io.landzcape.gradle

import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.assertj.core.api.Assertions
import org.gradle.testkit.runner.GradleRunner
import org.junit.Test
import java.io.File

class DiscoveryPluginTest {

    @Test
    fun mergeTest() {
        GradleRunner.create()
                .withProjectDir(File("integration-test/merger"))
                .withArguments("merge", "--stacktrace")
                .withPluginClasspath()
                .build()
        assertLandscapeJsonIsAsExpected("merger")
    }

    @Test
    fun bigMultiModuleTest() {
        GradleRunner.create()
                .withProjectDir(File("integration-test/big-multi-module"))
                .withArguments("discover", "--stacktrace")
                .withPluginClasspath()
                .build()
        assertLandscapeJsonIsAsExpected("big-multi-module")
    }

    @Test
    fun extractWebApp() {
        File("integration-test/extract/the-app").delete()
        GradleRunner.create()
                .withProjectDir(File("integration-test/extract"))
                .withArguments("extract", "--stacktrace")
                .withPluginClasspath()
                .build()
        Assertions.assertThat(File("integration-test/extract/the-app","index.html")).exists()
    }

    fun assertLandscapeJsonIsAsExpected(mvnProjectName: String) {
        val generatedLandscape = File("integration-test/${mvnProjectName}/landscape.json")
        val expectedLandscape = File("integration-test/${mvnProjectName}/expected-landscape.json")
        Assertions.assertThat(readJson(generatedLandscape))
                .isEqualTo(readJson(expectedLandscape))
                .withFailMessage("landscape.json for ${mvnProjectName} differs from expectation")
    }

    fun readJson(file: File): Any {
        val slurper = JsonSlurper()
        return slurper.parse(file)
    }
}