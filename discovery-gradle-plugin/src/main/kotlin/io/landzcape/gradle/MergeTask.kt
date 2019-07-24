package io.landzcape.gradle
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import io.landzcape.merger.LandscapeMerger
import io.landzcape.dto.LandscapeDto
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.TaskAction
import java.io.File

open class MergeTask : DefaultTask() {

    @Input
    var discoveries: ArrayList<String> = ArrayList()
    @Input
    var mergeTo: String = "landscape.json";

    @TaskAction
    fun assemble() {
            val inputs = discoveries.map { toFile(it) }
            val output = toFile(mergeTo)
            val mapper = ObjectMapper().registerKotlinModule()
            val landscapes: List<LandscapeDto> = inputs.map { file ->
                file.reader()
                        .use {
                            val landscapeDto: LandscapeDto = mapper.readValue(it)
                            landscapeDto
                        }
            }
            val assembled = LandscapeMerger().merge(landscapes)
            val serialized = ObjectMapper().writeValueAsString(assembled)
            output.printWriter().use { out ->
                out.print(serialized)
            }
    }

    private fun toFile(name: String): File {
        val file = File(name)
        if(!file.isAbsolute) {
            return File(project.projectDir, name).absoluteFile
        }
        return file
    }


}
