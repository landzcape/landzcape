package io.landzcape.discovery

data class DependencyConfiguration(
        val artifactId: ArtifactId,
        val structural: Boolean,
        val test: Boolean
        ) {

}
