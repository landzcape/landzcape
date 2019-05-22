package io.landzcape.merger

import io.landzcape.domain.ComponentId
import io.landzcape.domain.ContextId
import io.landzcape.domain.DomainId
import io.landzcape.domain.LayerId
import io.landzcape.dto.*

class LandscapeMerger {

    fun merge(landscapes: List<LandscapeDto>): LandscapeDto {
        val contexts = landscapes.flatMap { it.contexts }.groupBy { ContextId(it.name) }.values.map { mergeContexts(it) }
        val domains = landscapes.flatMap { it.domains }.groupBy { DomainId(it.name, ContextId(it.context)) }.values.map { mergeDomains(it) }
        val layers = landscapes.flatMap { it.layers }.groupBy { LayerId(it.name) }.values.map{ mergeLayers(it) }
        val components = landscapes.flatMap { it.components }
                .groupBy { ComponentId(it.name, it.group, it.version, DomainId.from(it.domain, ContextId.from(it.context))) }
                .values.map { mergeComponents(it) }

        return LandscapeDto(
                contexts = contexts,
                domains = domains,
                layers = layers,
                components = components
        )
    }

    private fun mergeComponents(components: List<ComponentDto>): ComponentDto {
        val interfaces = components.flatMap { it.interfaces.toList() }
                .distinctBy{ ComponentId(it.component, "", "", DomainId.from(it.domain, ContextId.from(it.context))) }
        val dependencies = components.flatMap { it.dependencies.toList() }
                .distinctBy{ ComponentId(it.component, "", "", DomainId.from(it.domain, ContextId.from(it.context))) }
        return ComponentDto(
                name = components.first().name,
                label = components.first().label,
                interfaces = interfaces,
                dependencies = dependencies,
                type = components.first().type,
                domain = components.first().domain,
                context = components.first().context,
                version = components.first().version,
                group = components.first().group,
                layer = components.first().layer
        )
    }

    private fun mergeLayers(layers: List<LayerDto>): LayerDto {
        val name = layers.first().name
        val label = layers.first().label
        return LayerDto(name, label)
    }

    private fun mergeDomains(domains: List<DomainDto>): DomainDto {
        val context = domains.first().context
        val name = domains.first().name
        val label = domains.first().label
        return DomainDto(name, label, context)
    }

    private fun mergeContexts(contexts: List<ContextDto>): ContextDto {
        val name = contexts.first().name
        val label = contexts.first().label
        return ContextDto(name, label)
    }

}