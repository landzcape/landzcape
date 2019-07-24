package io.landzcape.gradle

import groovy.lang.Closure
import io.landzcape.discovery.ContextConfiguration
import io.landzcape.discovery.DomainConfiguration
import io.landzcape.discovery.LayerConfiguration

open class LandscapeExtension {
    var target: String? = null
    var context: String? = null
    var domain: String? = null
    var layer: String? = null
    var type: String? = null
    var renameTo: String? = null
    var includes: List<String>? = null
    var excludes: List<String>? = null

    var layers: ArrayList<LayerConfiguration>? = null
    var contexts: ArrayList<ContextConfiguration>? = null
    var domains: ArrayList<DomainConfiguration>? = null

    fun layers(closure: Closure<LandscapeExtension>) {
        layers = ArrayList()
        closure.delegate = this
        closure.call()
    }

    fun layer(params: Map<Any, Any>) {
        val label = params.get("label")?.toString()
        val matching = params.get("matching")?.toString()
        val name = params.get("name")?.toString()
        val order = params.get("order")?.toString()
        layers?.add(LayerConfiguration(name, label, matching, order))
    }

    fun domains(closure: Closure<LandscapeExtension>) {
        domains = ArrayList()
        closure.delegate = this
        closure.call()
    }

    fun domain(params: Map<Any, Any>) {
        val label = params.get("label")?.toString()
        val context = params.get("context")?.toString()
        val name = params.get("name")?.toString()
        domains?.add(DomainConfiguration(name, context, label))
    }

    fun contexts(closure: Closure<LandscapeExtension>) {
        contexts = ArrayList()
        closure.delegate = this
        closure.call()
    }

    fun context(params: Map<Any, Any>) {
        val name = params.get("name")?.toString()
        val label = params.get("label")?.toString()
        contexts?.add(ContextConfiguration(name, label))
    }

}
