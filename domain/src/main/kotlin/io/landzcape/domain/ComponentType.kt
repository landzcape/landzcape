package io.landzcape.domain

enum class ComponentType {
    BUSINESS, CAPABILITY, APPLICATION, COMMON;

    companion object {

        fun fromNameOrElse(name: String?, default: ComponentType): ComponentType {
            if(name==null) {
                return default;
            }
            return valueOf(name.toUpperCase());
        }

    }
}