package io.landzcape.discovery

import io.landzcape.discovery.transformation.Transformer

class PathBasedDiscovery(
        val from: PathBasedDiscoverySource,
        val stripPrefix: String,
        val stripSuffix: String
) {

    fun getName(rootPath: String, componentPath: String): String {
        val sanitizedRootPath = sanitize(rootPath)
        val sanitizedChildPath = sanitize(componentPath)
        assertDiscoveryIsPossible(sanitizedRootPath, sanitizedChildPath)
        val relativeComponent = sanitizedChildPath.substring(sanitizedRootPath.length)
        val rootFolder = relativeComponent.substringBefore('/')
        val formattedName = formatName(rootFolder)
        assertNotEmpty(formattedName, sanitizedChildPath, sanitizedRootPath)
        return formattedName
    }

    private fun assertNotEmpty(formattedName: String, sanitizedChildPath: String, rootPath: String) {
        if (formattedName.isEmpty()) {
           throw IllegalArgumentException("Discovered name from path $sanitizedChildPath and $rootPath cannot be empty")
        }
    }

    private fun assertDiscoveryIsPossible(rootPath: String, componentPath: String) {
        if (!isDiscoveryPossible(rootPath, componentPath)) {
            throw IllegalArgumentException("Cannot discover name for $componentPath, not in the same directory structure.");
        }
    }

    fun isDiscoveryPossible(rootPath: String, componentPath: String): Boolean {
        val sanitizedComponentPath = sanitize(componentPath)
        val sanitizedRootPath = sanitize(rootPath)
        return sanitizedComponentPath.startsWith(sanitizedRootPath) && !sanitizedRootPath.equals(sanitizedComponentPath)
    }

    private fun formatName(componentPath: String): String {
        return componentPath
                .removeSuffix(stripSuffix)
                .removePrefix(stripPrefix)
    }

    private fun sanitize(componentPath: String): String {
        val withEndSlash = componentPath.replace('\\', '/') + "/"
        return withEndSlash.replace("//","/")
    }

}