package io.landzcape.gradle

import org.gradle.api.DefaultTask
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction
import java.io.File
import java.util.zip.ZipFile

open class ExtractExplorerTask : DefaultTask() {

    @Input
    var extractTo: String = "landscape-explorer";

    @TaskAction
    fun extractExplorer() {
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
        if (targetFolder.isAbsolute) {
            return targetFolder
        }
        return File(project.projectDir, extractTo)
    }
}
