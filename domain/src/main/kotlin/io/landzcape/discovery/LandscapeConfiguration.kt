package io.landzcape.discovery

import io.landzcape.domain.*

data class LandscapeConfiguration(
        val id: ArtifactId,
        val includes: List<String>?,
        val excludes: List<String>?,
        val structural: Boolean,
        val interfaces: List<DependencyConfiguration>,
        val dependencies: List<DependencyConfiguration>,
        val label: String?,
        val context: String?,
        val domain: String?,
        val layer: String?,
        val type: String?,
        val layers: List<LayerConfiguration>?,
        val domains: List<DomainConfiguration>?,
        val contexts: List<ContextConfiguration>?,
        val parentId: ArtifactId?
) {

    var parent: LandscapeConfiguration? = null

    fun getContextId(): ContextId {
        val recursiveContextId = getRecursiveContext()
        if (recursiveContextId != null) {
            return ContextId(recursiveContextId)
        }
        throw IllegalArgumentException("No context id could be resolved for "+id.name)
    }

    private fun getRecursiveContext(): String? {
        if (context != null) {
            return context
        }
        return parent?.getRecursiveContext()
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
        var recursiveDomainId = getRecursiveDomain()
        if(recursiveDomainId != null) {
            return DomainId(recursiveDomainId, getContextId())
        }
        throw IllegalArgumentException("No domain id could be resolved for "+id.name)
    }

    private fun getRecursiveDomain(): String? {
        if (domain != null) {
            return domain
        }
        return parent?.getRecursiveDomain()
    }

    fun getComponentName(): String {
        return getValue(id.name, "No artifact name specified")
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
        return getRecursiveGroup()
    }

    private fun getRecursiveGroup(): String {
        if (id.group != null) {
            return id.group;
        }
        val recursiveVersion = parent?.getRecursiveGroup()
        if(recursiveVersion != null){
            return recursiveVersion
        }
        throw IllegalArgumentException("No artifact group specified")
    }

    fun getComponentType(): ComponentType {
        return ComponentType.fromNameOrElse(getRecusiveType(), ComponentType.BUSINESS)
    }

    fun isIncluded(): Boolean {
        return isOnInclusionList() && !isOnExclusionList()
    }

    private fun isOnInclusionList(): Boolean {
        val includeList = getIncludeList()
        if(includeList!=null) {
            return includeList.any { idMatchingGlob(it) }
        }
        return true
    }

    private fun isOnExclusionList(): Boolean {
        val excludeList = getExcludeList()
        if(excludeList!=null) {
            return excludeList.any { idMatchingGlob(it) }
        }
        return false
    }

    private fun idMatchingGlob(artifactGlob: String): Boolean {
        val split = artifactGlob.split(":")
        if(split.size == 3) {
            return matchesGlob(split.get(0), id.group)
                    && matchesGlob(split.get(1), id.name)
                    && matchesGlob(split.get(2), id.version);
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

    fun getLayerDeclarations(): List<LayerWithMatcher> {
        if(layers != null) {
            return layers.map { configuration ->
                val layer = Layer(
                        id = LayerId(getValue(configuration.name, "No layer name specified")),
                        label = getValue(configuration.label, "No layer name specified")
                )
                LayerWithMatcher(layer, configuration.matching)
            }
        }
        return emptyList()
    }

    fun getLabelOrComponentName(): String {
        if(label != null) {
            return label
        }
        return getComponentName()
    }

    fun getComponentId(): ComponentId {
        return ComponentId(getComponentName(), getComponentGroup(), getComponentVersion(), getDomainId())
    }

}
