package io.landzcape.domain

class Landscape(val contexts: Collection<Context>, val layers: Collection<Layer>) {

    fun getComponents(): Collection<Component> {
        return contexts.flatMap { it.domains }.flatMap { it.components }
    }

}