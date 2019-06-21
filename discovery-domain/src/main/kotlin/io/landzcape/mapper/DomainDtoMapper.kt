package io.landzcape.mapper

import io.landzcape.discovery.ArtifactId
import io.landzcape.domain.*
import io.landzcape.dto.*

fun Landscape.toDto(): LandscapeDto {
    return LandscapeDto(
            contexts = this.contexts.map{it.toDto()},
            domains = this.contexts.flatMap { context ->
                context.domains.map { it.toDto(context)}
            }.distinct(),
            layers = this.layers.map { it.toDto() },
            components = this.contexts.flatMap { context ->
                context.domains.flatMap { domain ->
                    domain.components.map { it.toDto(context, domain) }
                }
            }
    )
}

fun Context.toDto(): ContextDto {
    return ContextDto(
            name = this.id.name,
            label = this.label
    )
}

fun Domain.toDto(context: Context) : DomainDto {
    return DomainDto(
            name = this.id.name,
            label = this.label,
            context = context.id.name
    )
}

fun Layer.toDto() : LayerDto {
    return LayerDto(
            name = this.id.name,
            label = this.label,
            order = this.order
    )
}

fun Component.toDto(context:Context, domain: Domain) : ComponentDto {
    return ComponentDto(
            name = this.id.name,
            group = this.id.group,
            version = this.id.version,
            label = this.label,
            layer = this.layer?.id?.name,
            context = context.id.name,
            domain = domain.id.name,
            type = ComponentTypeDto.valueOf(this.type.name).name,
            interfaces = this.interfaces.map { it.toDependencyDto() }.toList().plus(this.externalInterfaces.map{ it.toDependencyDto()}),
            dependencies = this.dependencies.map { it.toDependencyDto() }.toList().plus(this.externalDependencies.map{ it.toDependencyDto() })
    )
}

private fun Component.toDependencyDto(): DependencyDto {
    return DependencyDto(
            context = this.id.domain?.context?.name,
            domain = this.id.domain?.name,
            component = this.id.name
    )
}

private fun ArtifactId.toDependencyDto(): DependencyDto {
    return DependencyDto(
            component = this.name,
            context = null,
            domain = null
    )
}