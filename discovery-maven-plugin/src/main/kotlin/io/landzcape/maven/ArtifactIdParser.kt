package io.landzcape.maven

import io.landzcape.discovery.ArtifactId
import org.apache.maven.project.MavenProject

fun ArtifactId.Companion.fromProject(project: MavenProject) : ArtifactId {
    return ArtifactId(project.artifactId, project.groupId, project.version)
}