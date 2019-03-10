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
import java.util.zip.ZipFile

@Mojo(name = "extractWebApp", inheritByDefault = false, defaultPhase = LifecyclePhase.PROCESS_RESOURCES)
class MavenExtractWebAppMojo : AbstractMojo() {

    @Parameter(readonly = true)
    private val target: String = "landscape-web"

    @Parameter(defaultValue = "\${project}", readonly = true)
    private val mavenProject: MavenProject? = null

    @Throws(MojoExecutionException::class, MojoFailureException::class)
    override fun execute() {
        val targetFolder = getTargetFolder()
        val tempFile = File.createTempFile("landscape-'web", ".zip")
        this.javaClass.classLoader.getResourceAsStream("landscape-web.zip")
                .copyTo(tempFile.outputStream())
        ZipFile(tempFile).use { zip ->
            zip.entries().toList()
                    .filter { !it.isDirectory }
                    .forEach { entry ->
                        zip.getInputStream(entry)
                                .use { input ->
                                    val file = File(targetFolder, entry.name).absoluteFile
                                    file.parentFile.mkdirs()
                                    file.outputStream().use { output ->
                                        input.copyTo(output)
                                    }
                                }
                    }
        }
        tempFile.delete()
    }

    private fun getTargetFolder(): File {
        val targetFolder = File(target)
        if(targetFolder.isAbsolute) {
            return targetFolder
        }
        if (mavenProject != null) {
            return File(mavenProject.basedir, target)
        }
        return targetFolder
    }

}