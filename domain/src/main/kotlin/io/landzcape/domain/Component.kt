package io.landzcape.domain

import io.landzcape.discovery.ArtifactId

class Component(val id: ComponentId,
                val label: String,
                val layer: Layer?,
                val type: ComponentType = ComponentType.BUSINESS) {

    val componentDependencies = ArrayList<Component>()
    val componentExternalDependencies = ArrayList<ArtifactId>()
    val componentInterfaces = ArrayList<Component>()
    val componentExternalInterfaces = ArrayList<ArtifactId>()

    val dependencies: List<Component>
        get() = componentDependencies.toList()

    val externalDependencies: List<ArtifactId>
        get() = componentExternalDependencies.toList()

    val interfaces: List<Component>
        get() = componentInterfaces.toList()

    val externalInterfaces: List<ArtifactId>
        get() = componentExternalInterfaces.toList()
    fun addDependency(component: Component) {
        componentDependencies.add(component)
    }

    fun addInterface(component: Component) {
        componentInterfaces.add(component)
    }

    fun addExternalDependency(artifactId: ArtifactId) {
        componentExternalDependencies.add(artifactId)
    }

    fun addExternalInterface(artifactId: ArtifactId) {
        componentExternalInterfaces.add(artifactId)
    }

}