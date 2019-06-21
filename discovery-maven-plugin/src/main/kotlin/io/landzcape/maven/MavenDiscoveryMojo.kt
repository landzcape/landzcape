package io.landzcape.maven

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import io.landzcape.discovery.*
import io.landzcape.mapper.toDto
import io.landzcape.maven.util.ConfigurationAccessor
import org.apache.maven.model.Dependency
import org.apache.maven.plugin.AbstractMojo
import org.apache.maven.plugin.MojoExecutionException
import org.apache.maven.plugin.MojoFailureException
import org.apache.maven.plugins.annotations.LifecyclePhase
import org.apache.maven.plugins.annotations.Mojo
import org.apache.maven.plugins.annotations.Parameter
import org.apache.maven.plugins.annotations.ResolutionScope
import org.apache.maven.project.MavenProject
import java.io.File

@Mojo(name = "discover", inheritByDefault = false, defaultPhase = LifecyclePhase.PROCESS_RESOURCES, requiresDependencyCollection = ResolutionScope.COMPILE_PLUS_RUNTIME, requiresDependencyResolution = ResolutionScope.COMPILE_PLUS_RUNTIME)
class MavenDiscoveryMojo : AbstractMojo() {

    @Parameter(defaultValue = "\${project}", readonly = true)
    private val mavenProject: MavenProject? = null

    @Throws(MojoExecutionException::class, MojoFailureException::class)
    override fun execute() {

        if (mavenProject != null && !mavenProject.hasParent()) {

            val rootProject = mavenProject
            val allProjects = listOf(rootProject).union(rootProject.collectedProjects)
            val allConfigurations: List<LandscapeConfiguration> = allProjects
                    .map { project ->
                        val accessor = ConfigurationAccessor.fromPluginConfiguration(project)
                        val id = ArtifactId.fromProject(project)
                        val parentId = getParentId(project)
                        val label = project.name
                        val context = accessor.get("context")
                        val domain = accessor.get("domain")
                        val layer = accessor.get("layer")
                        val type = accessor.get("type")
                        val includes = accessor.getChild("includes").getList("include")
                        val excludes = accessor.getChild("excludes").getList("exclude")
                        val dependencies = (project.dependencies as List<Dependency>).map { dependency ->
                            val artifactId = ArtifactId(dependency.artifactId, dependency.groupId, dependency.version)
                            DependencyConfiguration(artifactId, isStructural(dependency.type), isTest(dependency.scope))
                        }
                        val interfaces = emptyList<DependencyConfiguration>()
                        LandscapeConfiguration(
                                id = id,
                                includes = includes,
                                excludes = excludes,
                                parentId = parentId,
                                structural = isStructural(project.artifact.type),
                                dependencies = dependencies,
                                interfaces = interfaces,
                                label = label,
                                context = context,
                                domain = domain,
                                layer = layer,
                                type = type,
                                layers = toLayers(accessor.getChild("layers")),
                                domains = toDomains(accessor.getChild("domains")),
                                contexts = toContexts(accessor.getChild("contexts"))
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
            File("landscape.json").printWriter().use { out ->
                out.print(serialized)
            }
        }
    }

    private fun isTest(scope: String?): Boolean {
        return scope == "test"
    }

    private fun getParentId(project: MavenProject): ArtifactId? {
        if(project.parent != null) {
            return ArtifactId.fromProject(project.parent)
        }
        return null
    }

    private fun toDomains(accessor: ConfigurationAccessor): List<DomainConfiguration>? {
        return accessor.getChildren("domain").map { child ->
            DomainConfiguration(child.get("name"), child.get("context"), child.get("label"))
        }
    }

    private fun toContexts(accessor: ConfigurationAccessor): List<ContextConfiguration>? {
        return accessor.getChildren("context").map { child ->
            ContextConfiguration(child.get("name"), child.get("label"))
        }
    }

    private fun toLayers(accessor: ConfigurationAccessor): List<LayerConfiguration>? {
        return accessor.getChildren("layer").map { child ->
            LayerConfiguration(
                    name = child.get("name"),
                    label = child.get("label"),
                    matching = child.get("matching"),
                    order = child.get("order")
            )
        }
    }

    private fun isStructural(type: String): Boolean {
        return type == "pom"
    }
}