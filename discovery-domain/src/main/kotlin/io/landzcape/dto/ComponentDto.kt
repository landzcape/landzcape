package io.landzcape.dto

data class ComponentDto(val name: String,
                        val group: String,
                        val version: String,
                        val label: String,
                        val layer: String? = null,
                        val domain: String? = null,
                        val context: String? = null,
                        val type: String = ComponentTypeDto.BUSINESS.name,
                        val interfaces: List<DependencyDto> = listOf(),
                        val dependencies: List<DependencyDto> = listOf()
) {
}

