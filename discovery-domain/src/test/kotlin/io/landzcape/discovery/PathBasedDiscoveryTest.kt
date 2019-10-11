package io.landzcape.discovery

import org.assertj.core.api.Assertions.assertThat
import org.junit.Test

class PathBasedDiscoveryTest {

    @Test
    fun givenALongDiscoveryPath_whenExtractingIt_itCorrectlyDiscovered() {
        val pathBasedDiscovery = PathBasedDiscovery(PathBasedDiscoverySource.FOLDER, "shop-", "-modules")
        val rootPath = "/root/"
        val componentPath = "/root/shop-sail-store-modules/superbrand/2017"
        assertThat(pathBasedDiscovery.isDiscoveryPossible(rootPath, componentPath))
        assertThat(pathBasedDiscovery.getName(rootPath, componentPath)).isEqualTo("sail-store")
    }

    @Test
    fun givenAShortPathName_whenExtractingIt_itCorrectlyDiscovered() {
        val pathBasedDiscovery = PathBasedDiscovery(PathBasedDiscoverySource.FOLDER, "shop-", "-modules")
        val rootPath = "/root/"
        val componentPath = "/root/shop-sail-store-modules"
        assertThat(pathBasedDiscovery.isDiscoveryPossible(rootPath, componentPath))
        assertThat(pathBasedDiscovery.getName(rootPath, componentPath)).isEqualTo("sail-store")
    }

}