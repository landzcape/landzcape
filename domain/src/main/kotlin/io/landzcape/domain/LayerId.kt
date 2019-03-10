package io.landzcape.domain

data class LayerId(val name: String) {

    companion object {
        fun fromName(name: String?): LayerId? {
            if(name==null) {
                return null
            }
            return LayerId(name)
        }
    }
}