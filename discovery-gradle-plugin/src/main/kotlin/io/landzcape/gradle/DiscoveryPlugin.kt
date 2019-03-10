package io.landzcape.gradle

import org.gradle.api.Plugin
import org.gradle.api.Project

open class DiscoveryPlugin : Plugin<Project>{

    override fun apply(root: Project) {
        root.allprojects.forEach {
            it.extensions.create("landscape", LandscapeExtension::class.java)
        }
        root.tasks.register("discover", DiscoveryTask::class.java)
    }
}
