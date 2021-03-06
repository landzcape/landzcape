package io.landzcape.discovery

import io.landzcape.domain.ComponentId
import io.landzcape.domain.Layer

class LayerWithMatcher(val layer: Layer, val matcher: String?) {

    fun isMatching(componentId: ComponentId): Boolean {
        return GlobMatcher(matcher).matches(componentId.name)
    }
}
