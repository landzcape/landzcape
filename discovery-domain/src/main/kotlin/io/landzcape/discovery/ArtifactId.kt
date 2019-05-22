package io.landzcape.discovery

data class ArtifactId(
        val name: String,
        val group: String?,
        val version: String?
) {
    companion object {

    }
}