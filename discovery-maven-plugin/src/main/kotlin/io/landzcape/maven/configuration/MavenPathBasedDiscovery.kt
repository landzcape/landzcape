package io.landzcape.maven.configuration

data class MavenPathBasedDiscovery(
        val from: String? = null,
        val stripPrefix: String? = null,
        val stripSuffix: String? = null
) {

}
