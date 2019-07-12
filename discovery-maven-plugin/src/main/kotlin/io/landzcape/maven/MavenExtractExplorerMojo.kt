package io.landzcape.maven

import org.apache.maven.plugin.AbstractMojo
import org.apache.maven.plugin.MojoExecutionException
import org.apache.maven.plugin.MojoFailureException
import org.apache.maven.plugins.annotations.LifecyclePhase
import org.apache.maven.plugins.annotations.Mojo
import org.apache.maven.plugins.annotations.Parameter
import org.apache.maven.project.MavenProject
import java.io.File
import java.util.zip.ZipFile

@Mojo(name = "extractExplorer", inheritByDefault = false, defaultPhase = LifecyclePhase.PROCESS_RESOURCES)
class MavenExtractExplorerMojo : AbstractMojo() {

    @Parameter(readonly = true)
    private val extractTo: String = "landscape-explorer"

    @Parameter(defaultValue = "\${project}", readonly = true)
    private val mavenProject: MavenProject? = null

    @Throws(MojoExecutionException::class, MojoFailureException::class)
    override fun execute() {
        val targetFolder = getTargetFolder()
        val tempFile = File.createTempFile("landscape-explorer", ".zip")
        this.javaClass.classLoader.getResourceAsStream("landscape-explorer.zip")
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
        val targetFolder = File(extractTo)
        if(targetFolder.isAbsolute) {
            return targetFolder
        }
        if (mavenProject != null) {
            return File(mavenProject.basedir, extractTo)
        }
        return targetFolder
    }

}