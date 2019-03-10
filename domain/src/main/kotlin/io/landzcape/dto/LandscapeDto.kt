package io.landzcape.dto

data class LandscapeDto(val contexts: List<ContextDto>,
                        val domains: List<DomainDto>,
                        val layers: List<LayerDto>,
                        val components: List<ComponentDto>) {

}