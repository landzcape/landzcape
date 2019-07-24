package io.landzcape.maven

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import io.landzcape.discovery.*
import io.landzcape.mapper.toDto
import io.landzcape.maven.configuration.MavenContext
import io.landzcape.maven.configuration.MavenDomain
import io.landzcape.maven.configuration.MavenLayer
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

    @Parameter(readonly = true)
    private val skipDiscovery = false

    @Throws(MojoExecutionException::class, MojoFailureException::class)
    override fun execute() {
        if (skipDiscovery) {
            log.info("Skip discovery")
        } else {
            discover()
        }
    }

    private fun discover() {
        if (mavenProject != null && !mavenProject.hasParent()) {
            log.info("Start discovery")
            val rootProject = mavenProject
            val allProjects = listOf(rootProject).union(rootProject.collectedProjects)
            val allConfigurations: List<LandscapeConfiguration> = allProjects
                    .map { project ->
                        val accessor = ConfigurationAccessor.fromPluginConfiguration(project)
                        val id = ArtifactId.fromProject(project)
                        val parentId = getParentId(project)
                        val label = project.name
                        val renameTo = accessor.get("renameTo")
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
                                renameTo = renameTo,
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
            allConfigurations.forEach { project ->
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

            val targetFile = getTargetFile(rootProject)
            targetFile.printWriter().use { out ->
                out.print(serialized)
            }
        } else {
            log.info("Skip discovery, project is not root project.")
        }
    }

    private fun getTargetFile(rootProject: MavenProject): File {
        val rootAccessor = ConfigurationAccessor.fromPluginConfiguration(rootProject)
        val target = rootAccessor.get("target")
        if (target != null) {
            val targetFile = File(target)
            if (targetFile.isAbsolute) {
                return targetFile
            }
            return File(rootProject.basedir, target)
        }
        return File(rootProject.basedir, "landscape.json")
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

    // for maven documentation, needs to be in sync with extraction above
    @Parameter
    private val target: String? = null
    @Parameter
    private val context: String? = null
    @Parameter
    private val domain: String? = null
    @Parameter
    private val type: String? = null
    @Parameter
    private val layer: String? = null
    @Parameter
    private val includes: List<String>? = null
    @Parameter
    private val excludes: List<String>? = null
    @Parameter
    private val layers: List<MavenLayer>? = null
    @Parameter
    private val domains: List<MavenDomain>? = null
    @Parameter
    private val contexts: List<MavenContext>? = null

}