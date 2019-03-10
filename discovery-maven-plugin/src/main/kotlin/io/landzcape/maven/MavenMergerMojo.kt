package io.landzcape.maven

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import io.landzcape.dto.LandscapeDto
import io.landzcape.merger.LandscapeMerger
import org.apache.maven.plugin.AbstractMojo
import org.apache.maven.plugin.MojoExecutionException
import org.apache.maven.plugin.MojoFailureException
import org.apache.maven.plugins.annotations.LifecyclePhase
import org.apache.maven.plugins.annotations.Mojo
import org.apache.maven.plugins.annotations.Parameter
import org.apache.maven.project.MavenProject
import java.io.File

@Mojo(name = "merge", inheritByDefault = false, defaultPhase = LifecyclePhase.PROCESS_RESOURCES)
class MavenMergerMojo : AbstractMojo() {

    @Parameter(readonly = true)
    private val discoveries: List<String> = listOf()

    @Parameter(readonly = true)
    private val target: String = "landscape.json"

    @Parameter(defaultValue = "\${project}", readonly = true)
    private val mavenProject: MavenProject? = null

    @Throws(MojoExecutionException::class, MojoFailureException::class)
    override fun execute() {
        if (!discoveries.isEmpty()) {
            val inputs = discoveries.map { toFile(it) }
            val output = toFile(target)
            if(inputs.contains(output)) {
                throw IllegalArgumentException("Target path must not be one of the discoveries.")
            }
            val mapper = ObjectMapper().registerKotlinModule()
            val landscapes: List<LandscapeDto> = inputs.map { file ->
                file.reader()
                        .use {
                            val landscapeDto: LandscapeDto = mapper.readValue(it)
                            landscapeDto
                        }
            }
            val merged = LandscapeMerger().merge(landscapes)
            val serialized = ObjectMapper().writeValueAsString(merged)
            output.printWriter().use { out ->
                out.print(serialized)
            }
        }
    }

    private fun toFile(name: String): File {
        val file = File(name)
        if(!file.isAbsolute && mavenProject != null) {
            return File(mavenProject.basedir, name).absoluteFile
        }
        return file
    }

}