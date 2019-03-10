package io.landzcape.maven.util

import com.google.common.collect.Lists
import org.apache.maven.project.MavenProject
import org.codehaus.plexus.util.xml.Xpp3Dom

class ConfigurationAccessor(val root: Xpp3Dom?) {

    fun get(propertyName: String): String? {
        if(root != null) {
            val child = root.getChild(propertyName)
            if(child!=null) {
                return child.value
            }
        }
        return null
    }

    fun getList(propertyName: String): List<String>? {
        if(root != null) {
            val children = root.getChildren(propertyName)
            if(children!=null) {
                return children.map { child -> child.value }
            }
        }
        return null
    }

    fun getChildren(propertyName: String): List<ConfigurationAccessor> {
        if(root != null) {
            val children = root.getChildren(propertyName)
            if(children!=null) {
                return children.map { child -> ConfigurationAccessor(child) }
            }
        }
        return Lists.newArrayList()
    }

    fun getChild(propertyName: String): ConfigurationAccessor {
        if(root != null) {
            val child = root.getChild(propertyName)
            return ConfigurationAccessor(child)
        }
        return ConfigurationAccessor(null)
    }

    companion object {
        fun fromPluginConfiguration(project: MavenProject): ConfigurationAccessor {
            for (plugin in project.buildPlugins) {
                if (plugin.artifactId == "discovery-maven-plugin" && plugin.groupId == "io.landzcape") {
                    if (plugin.configuration != null) {
                        val dom = plugin.configuration as Xpp3Dom
                        return ConfigurationAccessor(dom)
                    }
                }
            }
            return ConfigurationAccessor(null)
        }
    }
}