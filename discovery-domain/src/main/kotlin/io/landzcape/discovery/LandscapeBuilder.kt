package io.landzcape.discovery

import io.landzcape.domain.*

class LandscapeBuilder(val configurations: List<LandscapeConfiguration>) {

    fun build(): Landscape {
        var layers = configurations
                .flatMap { it.getLayerDeclarations() }
                .distinctBy{ s -> s.layer.id }
        val contextLabelsById = configurations
                .map{ it.contexts }
                .filterNotNull()
                .flatMap {it}
                .associateBy({it.getContextId()}, {it.getContextLabel()})
        val domainLabelsById = configurations
                .map{ it.domains }
                .filterNotNull()
                .flatMap { it }
                .associateBy({it.getDomainId()}, {it.getDomainLabel()})

        val componentsByArtifactId = HashMap<ArtifactId, Component>()
        val contexts = configurations
                .groupBy { config -> config.getContextId() }
                .map { (contextId, contextConfigs) ->
                    val contextLabel = contextLabelsById.getOrElse(contextId) { throw IllegalArgumentException("No configuration for context with id "+contextId.name) }
                    val domains = contextConfigs
                            .groupBy { config -> config.getDomainId() }
                            .map { (domainId, domainConfigs) ->
                                val domainLabel = domainLabelsById.getOrElse( domainId) { throw IllegalArgumentException("No configuration for domain with id "+domainId.name+" in context "+domainId.context.name) }
                                val components = domainConfigs
                                        .filter { it.isIncluded() }
                                        .filterNot{ it.structural }
                                        .map { config ->
                                            var layerWithMatcher = getLayerWithMatcher(layers, config)
                                            val component = Component(
                                                    id = config.getComponentId(),
                                                    label = config.getLabelOrBeautifiedComponentName(),
                                                    type = config.getComponentType(),
                                                    layer = layerWithMatcher?.layer
                                            )
                                            componentsByArtifactId.put(config.id, component)
                                            component
                                        }.sortedBy { it.id.name }
                                Domain(domainId, domainLabel, components)
                            }.sortedBy { it.id.name }
                    Context(contextId, contextLabel, domains)
                }.sortedBy { it.id.name }
        val sortedLayers = layers
                .map { it.layer }
                .sortedBy { it.id.name }
        val landscape = Landscape(contexts, sortedLayers)
        configurations.forEach { configuration ->
            val component: Component? = componentsByArtifactId[configuration.id]
            if(component!==null) {
                val dependencies = configuration.getIncludedDependencies()
                        .filterNot { it.structural }
                        .filterNot { it.test }
                dependencies
                        .map { componentsByArtifactId[it.artifactId] }
                        .filterNotNull()
                        .sortedBy { it.id.name }
                        .forEach { component.addDependency(it) }
                dependencies
                        .filterNot { componentsByArtifactId.containsKey(it.artifactId)}
                        .sortedBy { it.artifactId.name }
                        .forEach { component.addExternalDependency(it.artifactId) }

                val defaultInterfaceName = ArtifactId("${component.id.name}-api", component.id.group, component.id.version)
                val interfaceComponent = componentsByArtifactId[defaultInterfaceName]
                if(interfaceComponent != null) {
                    component.addInterface(interfaceComponent)
                }
            }
        }
        return landscape
    }

    private fun getLayerWithMatcher(layers: List<LayerWithMatcher>, config: LandscapeConfiguration): LayerWithMatcher? {
        var matchByName = layers.find { layer -> layer.layer.id.name.equals(config.getLayerName()) }
        if (matchByName != null) {
            return matchByName
        } else {
            val matchByWildcard = layers.find { it.isMatching(config.getComponentId()) }
            if (matchByWildcard != null) {
                return matchByWildcard
            }
        }
        return null
    }

}