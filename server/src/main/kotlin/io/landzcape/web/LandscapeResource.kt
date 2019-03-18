package io.landzcape.web

import io.landzcape.dto.*
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/landscape.json")
class LandscapeResource {

    @GetMapping
    fun getLandscape() : LandscapeDto {
        val inventoryDomain = DomainDto("inventory", "Inventory","surfshop")
        val reservationDomain = DomainDto("reservation", "Reservation","surfshop")
        val customerDomain = DomainDto("customer", "Customer","surfshop")
        val dashboardDomain = DomainDto("dashboard", "Dashboard","surfshop")
        val creditcheckDomain = DomainDto("creditcheck", "Credit Check","surfshop")
        val mailDomain = DomainDto("mail", "Mailer", "kiteshop")
        val advertDomain = DomainDto("advert", "Advertizing", "kiteshop")
        val statisticsDomain = DomainDto("statistics", "Statistics", "surfshop")
        var surfContext = ContextDto("surfshop", "The surf shop")
        var kiteContext = ContextDto("kiteshop", "The kite shop")
        val ui = LayerDto("ui", "User Interface")
        val Es = LayerDto("es", "Edge Service")
        val cs = LayerDto("cs", "Core Service")

        val common = ComponentDto(
                name = "common",
                group = "com.sufshop",
                version = "1.0.0",
                label = "Common",
                context = "surfshop",
                type = ComponentTypeDto.COMMON.name
        )
        val securityCapability = ComponentDto(
                name="security-capabililty",
                group="com.surfshop",
                version="1.0.0",
                label="Security Capability",
                context = "surfshop",
                type = ComponentTypeDto.CAPABILITY.name,
                dependencies = listOf(dependencyTo(common))
        )

        val restCapability = ComponentDto(
                name="rest-capability",
                group="com.surfshop",
                version="1.0.0",
                label="REST Capbaility",
                type = ComponentTypeDto.CAPABILITY.name,
                dependencies = listOf(dependencyTo(securityCapability)))
        val inventoryCsApi = ComponentDto(
                name="inventory-cs-api",
                group="com.surfshop",
                version="1.0.0",
                domain="inventory",
                label="Inventory CS API",
                layer = "cs",
                type = ComponentTypeDto.BUSINESS.name,
                context = "surfshop")
        val inventoryCs = ComponentDto(
                name="inventory-cs",
                group="com.surfshop",
                version="1.0.0",
                domain="inventory",
                label="Inventory CS",
                layer = "cs",
                context = "surfshop",
                interfaces = listOf(dependencyTo(inventoryCsApi)),
                dependencies = listOf(dependencyTo(inventoryCsApi)))
        val inventoryEs = ComponentDto(
                name="inventory-es",
                group="com.surfshop",
                version="1.0.0",
                domain="inventory",
                label="Inventory ES",
                layer = "es",
                context="surfshop",
                dependencies = listOf(dependencyTo(inventoryCsApi), dependencyTo(restCapability), dependencyTo(common)))
        val creditcheckCs = ComponentDto(
                name="creditcheck-cs",
                group="com.surfshop",
                version="1.0.0",
                domain="creditcheck",
                label="Credit Check CS",
                layer = "cs",
                context = "surfshop",
                dependencies = listOf(dependencyTo(common)))
        val reservationCs = ComponentDto(
                name="reservation-cs",
                group="com.surfshop",
                version="1.0.0",
                domain="reservation",
                label="Reservation CS",
                layer = "cs",
                context = "surfshop")
        val customerCs = ComponentDto(
                name="customer-cs",
                group="com.surfshop",
                version="1.0.0",
                domain="customer",
                label="Customer CS",
                layer = "cs",
                context = "surfshop")
        val customerInformationEs = ComponentDto(
                name="customer-information-es",
                group="com.surfshop",
                version="1.0.0",
                domain="customer",
                label="Customer Information ES",
                layer = "es",
                context = "surfshop")
        val customerEs = ComponentDto(
                name="customer-es",
                group="com.surfshop",
                version="1.0.0",
                domain="customer",
                label="Customer ES",
                layer = "es",
                context = "surfshop",
                dependencies = listOf(dependencyTo(customerCs), dependencyTo(restCapability), dependencyTo(common)))
        val reservationUi = ComponentDto(
                name="reservation-ui",
                group="com.surfshop",
                version="1.0.0",
                domain="reservation",
                label="Reservation UI",
                layer = "ui",
                context = "surfshop",
                dependencies = listOf(dependencyTo(reservationCs), dependencyTo(creditcheckCs), dependencyTo(customerEs), dependencyTo(restCapability)))
        val kiteadUi = ComponentDto(
                name="kitead-ui",
                group="com.kiteshop",
                version="1.0.0",
                domain="advert",
                label="Kite Ad UI",
                layer = "ui",
                context = "kiteshop",
                dependencies = listOf())
        val kiteadEs = ComponentDto(
                name="kitead-es",
                group="com.kiteshop",
                version="1.0.0",
                domain="advert",
                label="Kite Ad ES",
                layer = "es",
                context = "kiteshop",
                dependencies = listOf(dependencyTo(restCapability), dependencyTo(common)))
        val kitemailerCs = ComponentDto(
                name="kitemail-cs",
                group="com.kiteshop",
                version="1.0.0",
                domain="mail",
                label="Kite Mailer CS",
                layer = "cs",
                context = "kiteshop",
                dependencies = listOf())
        val statisticsEs = ComponentDto(
                name="statistics-es",
                group="com.surfshop",
                version="1.0.0",
                domain="statistics",
                label="Statistics ES",
                layer = "es",
                context = "surfshop",
                dependencies = listOf(dependencyTo(restCapability), dependencyTo(common)))

        val dashboardUi = ComponentDto(
                name="dashboard-ui",
                group="com.surfshop",
                version="1.0.0",
                domain="dashboard",
                label="Dashboard UI",
                layer = "ui",
                context = "surfshop",
                dependencies = listOf(dependencyTo(statisticsEs), dependencyTo(kiteadEs), dependencyTo(customerEs), dependencyTo(inventoryEs)))

        val kiteApp = ComponentDto(
                name="kite-app",
                group="com.surfshop",
                version="1.0.0",
                label="Kite App",
                context = "kiteshop",
                type = ComponentTypeDto.APPLICATION.name,
                dependencies = listOf(dependencyTo(kiteadEs), dependencyTo(kitemailerCs))
        )

        val surfshopApp = ComponentDto(
                name="surf-app",
                group="com.surfshop",
                version="1.0.0",
                label="Surf App",
                context = "surfshop",
                type = ComponentTypeDto.APPLICATION.name,
                dependencies = listOf(dependencyTo(reservationUi), dependencyTo(customerEs), dependencyTo(statisticsEs), dependencyTo(inventoryEs))
        )
        return LandscapeDto(
                contexts = listOf(surfContext, kiteContext),
                domains = listOf(statisticsDomain, creditcheckDomain, inventoryDomain, reservationDomain, customerDomain, dashboardDomain, mailDomain, advertDomain),
                components = listOf(surfshopApp, kiteApp, common, restCapability, securityCapability, statisticsEs, customerInformationEs, kiteadUi, kiteadEs, kitemailerCs, dashboardUi, inventoryEs, inventoryCs, inventoryCsApi, reservationUi, reservationCs, customerCs, customerEs, creditcheckCs),
                layers = listOf(ui, Es, cs)
        )

    }

    private fun dependencyTo(componentDto: ComponentDto): DependencyDto {
        return DependencyDto(
                component = componentDto.name,
                domain = componentDto.domain,
                context = componentDto.context
        )
    }

}
