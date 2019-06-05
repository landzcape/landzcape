package io.landzcape.gradle
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import io.landzcape.discovery.*
import io.landzcape.mapper.toDto
import org.gradle.api.DefaultTask
import org.gradle.api.Project
import org.gradle.api.artifacts.ProjectDependency
import org.gradle.api.tasks.TaskAction
import java.io.File

open class DiscoveryTask : DefaultTask() {

    @TaskAction
    fun discover() {
        val allConfigurations: List<LandscapeConfiguration> = project.rootProject.allprojects
                .map { project ->
                    val extension = project.extensions.getByName("landscape") as LandscapeExtension?
                    val id = ArtifactId.fromProject(project)
                    val parentId = getParentId(project)
                    val label = project.description
                    val dependencies = project.configurations
                            .map { it.name to it.dependencies }
                            .flatMap { (configurationName, dependencies) ->
                                dependencies
                                        .withType(ProjectDependency::class.java)
                                        .map { dependency ->
                                    val artifactId = ArtifactId.fromProject(dependency.dependencyProject)
                                    DependencyConfiguration(artifactId, isStructural(dependency.dependencyProject), isTest(configurationName))
                                }
                    }
                    val interfaces = emptyList<DependencyConfiguration>()
                    LandscapeConfiguration(
                            id = id,
                            includes = extension?.includes,
                            excludes = extension?.excludes,
                            structural = isStructural(project),
                            interfaces = interfaces,
                            dependencies = dependencies,
                            label = label,
                            context = extension?.context,
                            domain = extension?.domain,
                            layer = extension?.layer,
                            type = extension?.type,
                            layers = extension?.layers,
                            domains = extension?.domains,
                            contexts = extension?.contexts,
                            parentId = parentId
                    )
                }
        val configurationsById = allConfigurations.associateBy { it.id }
        allConfigurations.forEach{ project ->
            run {
                project.parent = configurationsById[project.parentId]
            }
        }
        val builder = LandscapeBuilder(allConfigurations)
        val landscape = builder.build()
        val dto = landscape.toDto()
        val objectMapper = ObjectMapper()
        objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
        val serialized = objectMapper.writeValueAsString(dto)
        File(project.projectDir,"landscape.json").printWriter().use { out ->
            out.print(serialized)
        }
    }

    private fun isTest(configurationName: String?): Boolean {
        return configurationName == "test"
    }

    private fun isStructural(project1: Project) = !project1.plugins.hasPlugin("java")

    private fun getParentId(project: Project): ArtifactId? {
        val parent: Project? = project.parent
        if(parent != null) {
            return ArtifactId.fromProject(parent)
        }
        return null
    }
}
