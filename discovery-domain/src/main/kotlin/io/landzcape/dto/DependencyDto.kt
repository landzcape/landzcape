package io.landzcape.dto

data class DependencyDto(val component: String,
                         val domain: String?,
                         val context: String?) {
}