package io.landzcape.merger

import io.landzcape.dto.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test

class LandscapeMergerTest {

    @Test
    fun assemble() {

        val landscapes = listOf(
                LandscapeDto(
                        contexts = listOf(
                                ContextDto(name = "surfshop", label = "Surfshop"),
                                ContextDto(name = "kiteshop", label = "Kiteshop")
                        ),
                        layers = listOf(
                                LayerDto(name = "ui", label = "User Interface", order = 0)
                        ),
                        domains = listOf(
                                DomainDto(name = "inventory", label = "Inventory", context = "surfshop"),
                                DomainDto(name = "advertising", label = "Advertising", context = "kiteshop")
                        ),
                        components = listOf(
                                ComponentDto(
                                        name = "inventory-ui",
                                        group = "",
                                        version = "",
                                        label = "Inventory",
                                        domain = "inventory",
                                        context = "surfshop",
                                        layer = "ui"
                                ),
                                ComponentDto(
                                        name = "kitead-ui",
                                        group = "",
                                        version = "",
                                        label = "Advertising",
                                        domain = "advertising",
                                        context = "kiteshop",
                                        layer = "ui"
                                )
                        )

                ),
                LandscapeDto(
                        contexts = listOf(
                                ContextDto(name = "kiteshop", label = "Kiteshop")
                        ),
                        layers = listOf(
                                LayerDto(name = "ui", label = "Ignored ui label", order=42),
                                LayerDto(name = "es", label = "Edge Service", order = 1),
                                LayerDto(name = "cs", label = "Core Service", order = 2)
                        ),
                        domains = listOf(
                                DomainDto(name = "inventory", label = "Ignored inventory label", context = "surfshop")
                        ),
                        components = listOf(
                                ComponentDto(
                                        name = "inventory-es",
                                        group = "",
                                        version = "",
                                        label = "Inventory",
                                        domain = "inventory",
                                        context = "surfshop",
                                        layer = "es"
                                ),
                                ComponentDto(
                                        name = "inventory-cs",
                                        group = "",
                                        version = "",
                                        label = "Inventory",
                                        domain = "inventory",
                                        context = "surfshop",
                                        layer = "cs"
                                )
                        )
                )
        )


        val assembled = LandscapeMerger().merge(landscapes)

        assertThat(assembled).isEqualTo(
                LandscapeDto(
                        contexts = listOf(
                                ContextDto(name = "surfshop", label = "Surfshop"),
                                ContextDto(name = "kiteshop", label = "Kiteshop")
                        ),
                        layers = listOf(
                                LayerDto(name = "ui", label = "User Interface", order =  0),
                                LayerDto(name = "es", label = "Edge Service", order = 1),
                                LayerDto(name = "cs", label = "Core Service", order = 2)
                        ),
                        domains = listOf(
                                DomainDto(name = "inventory", label = "Inventory", context = "surfshop"),
                                DomainDto(name = "advertising", label = "Advertising", context = "kiteshop")
                        ),
                        components = listOf(
                                ComponentDto(
                                        name = "inventory-ui",
                                        group = "",
                                        version = "",
                                        label = "Inventory",
                                        domain = "inventory",
                                        context = "surfshop",
                                        layer = "ui"
                                ),
                                ComponentDto(
                                        name = "kitead-ui",
                                        group = "",
                                        version = "",
                                        label = "Advertising",
                                        domain = "advertising",
                                        context = "kiteshop",
                                        layer = "ui"
                                ),
                                ComponentDto(
                                        name = "inventory-es",
                                        group = "",
                                        version = "",
                                        label = "Inventory",
                                        domain = "inventory",
                                        context = "surfshop",
                                        layer = "es"
                                ),
                                ComponentDto(
                                        name = "inventory-cs",
                                        group = "",
                                        version = "",
                                        label = "Inventory",
                                        domain = "inventory",
                                        context = "surfshop",
                                        layer = "cs"
                                )
                        )
                )
        )
    }
}