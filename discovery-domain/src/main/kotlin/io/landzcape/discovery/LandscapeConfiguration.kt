package io.landzcape.discovery

import io.landzcape.discovery.transformation.Transformer
import io.landzcape.domain.*
import io.landzcape.util.GlobMatcher

data class LandscapeConfiguration(
        val id: ArtifactId,
        val path: String,
        val renameTo: String?,
        val regroupTo: String?,
        val includes: List<String>?,
        val excludes: List<String>?,
        val structural: Boolean,
        val dependencies: List<DependencyConfiguration>,
        val label: String?,
        val context: String?,
        val contextDiscovery: PathBasedDiscovery?,
        val domain: String?,
        val domainDiscovery: PathBasedDiscovery?,
        val layer: String?,
        val type: String?,
        val layers: List<LayerConfiguration>?,
        val domains: List<DomainConfiguration>?,
        val contexts: List<ContextConfiguration>?,
        val parentId: ArtifactId?
) {

    var parent: LandscapeConfiguration? = null

    fun getContextId(): ContextId {
        val recursiveContextId = getRecursiveContext(path)
        if (recursiveContextId != null) {
            return ContextId(recursiveContextId)
        }
        throw IllegalArgumentException("No context id could be resolved for "+id.name)
    }

    private fun getRecursiveContext(childPath: String): String? {
        if (contextDiscovery != null) {
            if (contextDiscovery.isDiscoveryPossible(path, childPath)) {
                return contextDiscovery.getName(path, childPath)
            }
        }
        if (context != null) {
            return context
        }
        return parent?.getRecursiveContext(path)
    }

    fun getLayerName(): String? {
        return getRecursiveLayerName()
    }

    private fun getRecursiveLayerName(): String? {
        if (layer != null) {
            return layer
        }
        return parent?.getRecursiveLayerName()
    }

    fun getDomainId(): DomainId {
        var recursiveDomainId = getRecursiveDomain(path)
        if(recursiveDomainId != null) {
            return DomainId(recursiveDomainId, getContextId())
        }
        throw IllegalArgumentException("No domain id could be resolved for "+id.name)
    }

    private fun getRecursiveDomain(childPath: String): String? {
        if(domainDiscovery != null) {
            if(domainDiscovery.isDiscoveryPossible(path, childPath)) {
                return domainDiscovery.getName(path, childPath)
            }
        }
        if (domain != null) {
            return domain
        }
        return parent?.getRecursiveDomain(path)
    }

    fun getComponentName(): String {
        val renamed = getRecursiveRenameTo()
        if (renamed!= null) {
            return renamed
        }
        return getValue(id.name, "No artifact name specified")
    }

    private fun getRecursiveRenameTo(): String? {
        if (renameTo != null) {
            return renameTo
        }
        return parent?.getRecursiveRenameTo()
    }

    fun getComponentVersion(): String {
        return getRecursiveVersion()
    }

    private fun getRecursiveVersion(): String {
        if (id.version != null) {
            return id.version;
        }
        val recursiveVersion = parent?.getRecursiveVersion()
        if(recursiveVersion != null){
            return recursiveVersion
        }
        throw IllegalArgumentException("No artifact version specified")
    }

    fun getComponentGroup(): String {
        val renamed = getRecursiveRegroupTo()
        if(renamed != null) {
            return renamed
        }
        return getRecursiveGroup()
    }

    private fun getRecursiveRegroupTo(): String? {
        if (regroupTo != null) {
            return regroupTo
        }
        val recursiveRename = parent?.getRecursiveRegroupTo()
        if(recursiveRename != null){
            return recursiveRename
        }
        return null
    }

    private fun getRecursiveGroup(): String {
        if (id.group != null) {
            return id.group
        }
        val recursiveGroup = parent?.getRecursiveGroup()
        if(recursiveGroup != null){
            return recursiveGroup
        }
        throw IllegalArgumentException("No artifact group specified")
    }

    fun getComponentType(): ComponentType {
        return ComponentType.fromNameOrElse(getRecusiveType(), ComponentType.BUSINESS)
    }

    fun isIncluded(): Boolean {
        return isIncludedOrNotExcluded(id)
    }

    fun getIncludedDependencies(): List<DependencyConfiguration> {
        return dependencies.filter { isIncludedOrNotExcluded(it.artifactId) }
    }

    private fun isIncludedOrNotExcluded(artifactId: ArtifactId): Boolean {
        return isOnInclusionList(artifactId) && !isOnExclusionList(artifactId)
    }

    private fun isOnInclusionList(artifactId: ArtifactId): Boolean {
        val includeList = getIncludeList()
        if(includeList!=null) {
            return includeList.any { idMatchingGlob(artifactId, it) }
        }
        return true
    }

    private fun isOnExclusionList(artifactId: ArtifactId): Boolean {
        val excludeList = getExcludeList()
        if(excludeList!=null) {
            return excludeList.any { idMatchingGlob(artifactId, it) }
        }
        return false
    }

    private fun idMatchingGlob(artifactId: ArtifactId, artifactGlob: String): Boolean {
        val split = artifactGlob.split(":")
        if(split.size == 3) {
            return matchesGlob(split.get(0), artifactId.group)
                    && matchesGlob(split.get(1), artifactId.name)
                    && matchesGlob(split.get(2), artifactId.version);
        }
        return false
    }

    private fun matchesGlob(glob: String, part: String?): Boolean {
        return glob.isEmpty() || GlobMatcher(glob).matches(part)
    }


    private fun getExcludeList(): Set<String>? {
        val parentExcludes = parent?.getExcludeList()
        if (excludes != null) {
            if(parentExcludes != null) {
                return parentExcludes.union(excludes)
            }
            return excludes.toSet()
        } else if(parentExcludes != null) {
            return parentExcludes.toSet()
        }
        return null
    }

    private fun getIncludeList(): Set<String>? {
        val parentIncludes = parent?.getIncludeList()
        if (includes != null) {
            if(parentIncludes != null) {
                return parentIncludes.union(includes)
            }
            return includes.toSet()
        } else if(parentIncludes != null) {
            return parentIncludes.toSet()
        }
        return null
    }

    private fun getRecusiveType(): String? {
        if(type != null) {
            return type;
        }
        return parent?.getRecusiveType()
    }

    private fun getValue(value: String?, message: String): String {
        if (value != null) {
            return value
        }
        throw IllegalArgumentException(message)
    }

    private fun getNumberOrZero(value: String?, message: String): Int {
        if (value == null) {
            return 0
        }
        val number = value.toIntOrNull()
        if (number == null) {
            throw IllegalArgumentException(message)
        }
        return number
    }

    fun getLayerDeclarations(): List<LayerWithMatcher> {
        if(layers != null) {
            return layers.map { configuration ->
                val layer = Layer(
                        id = LayerId(getValue(configuration.name, "No layer name specified")),
                        label = getValue(configuration.label, "No layer name specified"),
                        order = getNumberOrZero(configuration.order, "Invalid layer order")
                )
                LayerWithMatcher(layer, configuration.matching)
            }
        }
        return emptyList()
    }

    fun getLabelOrBeautifiedComponentName(): String {
        if(!label.isNullOrBlank()) {
            return label
        }
        val componentName = getComponentName()
        return Transformer("any-to-capital").transform(componentName)
    }

    fun getComponentId(): ComponentId {
        return ComponentId(getComponentName(), getComponentGroup(), getComponentVersion(), getDomainId())
    }

}
