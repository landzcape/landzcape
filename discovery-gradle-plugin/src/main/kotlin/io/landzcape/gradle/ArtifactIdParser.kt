package io.landzcape.gradle

import io.landzcape.discovery.ArtifactId
import org.gradle.api.Project

fun ArtifactId.Companion.fromProject(project: Project) : ArtifactId {
    return ArtifactId(project.name, project.group.toString(), project.version.toString())
}