import js.*
import io.landzcape.discovery.*
import io.landzcape.mapper.toDto
import path.dirname
import path.resolve

class AngularDiscovery {

    companion object {
        val DISCOVER_JSON = "discover.json"
    }

    @JsName("discover")
    fun discover(tsConfigPath: String) {

        val errorHandler = object : ErrorHandler {
            override fun error(error: Any, path: String) {}
        }

        val reader = object : FileReader {
            override fun get(name: String): Any = readFile(name, "utf-8")
            override fun getSync(name: String): Any = readFileSync(name, "utf-8")
        }

        val root = path.resolve(dirname(tsConfigPath))
        val structures: Map<String, LandscapeConfiguration> = getDiscoverJsonStructures(root)
        val symbols = ProjectSymbols(tsConfigPath, reader, errorHandler)
        val modules = symbols.getModules()
                .filter { isNamedSymbol(it) && isLocalModule(it.symbol.filePath, root) }
                .associateBy(
                { module -> path.resolve(module.symbol.filePath) },
                { module ->
                    LandscapeConfiguration(
                            id = ArtifactId(module.symbol.name, null, null),
                            renameTo = null,
                            includes = null,
                            excludes = null,
                            parentId = null,
                            structural = false,
                            dependencies = toModuleDependencies(module.getImportedModules(), root),
                            interfaces = emptyList(),
                            label = module.symbol.name,
                            context = null,
                            domain = null,
                            layer = null,
                            type = null,
                            layers = emptyList(),
                            domains = emptyList(),
                            contexts = emptyList()
                    )
                }
        )

        val configurations = structures.plus(modules)
        configurations.forEach{ entry ->
            entry.value.parent = findParentInStructure(configurations, entry.key)
        }

        val builder = LandscapeBuilder(configurations.values.toList())
        val reserialized = JSON.parse<Any>(JSON.stringify(builder.build().toDto()))
        val serialized = JSON.stringify(reserialized, { _, value ->
            if (value == null) {
                undefined
            } else {
                value
            }
        }, 2)
        val targetPath = getTargetPath(root)
        writeFileSync(targetPath, serialized)
    }

    private fun isNamedSymbol(symbol: ModuleSymbol): Boolean {
        return symbol?.symbol?.name != null
    }

    private fun getTargetPath(root: String): String {
        val rootJsonPath = "${root}/discover.json"
        if (existsSync(rootJsonPath)) {
            val rootJson = parseJson(rootJsonPath)
            val target = rootJson.target
            if (target) {
                return resolve(root, target)
            }
        }
        return "${root}/landscape.json"
    }

    private fun isLocalModule(path: String, root: String): Boolean {
        return resolve(path).startsWith(root)
         && !resolve(path).startsWith(resolve(root,"node_modules"))
    }

    private fun toModuleDependencies(importedModules: Array<ModuleSymbol>, root: String): List<DependencyConfiguration> {
        return importedModules
                .filter { isNamedSymbol(it) && isLocalModule(it.symbol.filePath, root) }
                .map {
                    DependencyConfiguration(
                            artifactId = ArtifactId(it.symbol.name, null, null),
                            structural = false,
                            test = false
                    )
                }
    }

    private fun findParentInStructure(structuresByPath: Map<String, LandscapeConfiguration>, filePath: String): LandscapeConfiguration? {
        var dirname = path.dirname(filePath)
        if(dirname === filePath) {
            dirname = path.dirname(dirname)
        }
        while (path.dirname(dirname) !== dirname) {
            if (structuresByPath.containsKey(dirname)) {
                return structuresByPath.get(dirname)
            }
            dirname = path.dirname(dirname)
        }
        return null
    }

    private fun getDiscoverJsonStructures(root: String): Map<String, LandscapeConfiguration> {
        val jsonObjects = getDiscoverJsonObjects(root)
        val byPath = jsonObjects.mapValues { entry ->
            val discover = entry.value
            LandscapeConfiguration(
                    id = ArtifactId(discover.name, discover.group, discover.version),
                    renameTo = discover.renameTo,
                    includes = toPatterns(discover.includes),
                    excludes = toPatterns(discover.excludes),
                    parentId = null,
                    structural = true,
                    dependencies = toDependencies(discover.dependencies),
                    interfaces = toInterfaces(discover.interfaces),
                    label = discover.label,
                    context = discover.context,
                    domain = discover.domain,
                    layer = discover.layer,
                    type = discover.type,
                    layers = toLayers(discover.layers),
                    domains = toDomains(discover.domains),
                    contexts = toContexts(discover.contexts)
            )
        }
        return byPath
    }

    private fun toPatterns(patterns: dynamic): List<String>? {
        if(patterns) {
            return (patterns as Array<String>).toList()
        }
        return null
    }

    private fun toContexts(contexts: dynamic): List<ContextConfiguration>? {
        if (!contexts) {
            return emptyList()
        }
        return (contexts as Array<dynamic>).map { ContextConfiguration(it.name, it.label) }
    }

    private fun toDomains(domains: dynamic): List<DomainConfiguration>? {
        if (!domains) {
            return emptyList()
        }
        return (domains as Array<dynamic>).map { DomainConfiguration(it.name, it.context, it.label) }
    }

    private fun toLayers(layers: dynamic): List<LayerConfiguration>? {
        if (!layers) {
            return emptyList()
        }
        return (layers as Array<dynamic>).map { LayerConfiguration(it.name, it.label, it.matching, it.order) }
    }

    private fun toInterfaces(interfaces: dynamic): List<DependencyConfiguration> {
        return toDependencyConfigurations(interfaces)
    }

    private fun toDependencies(dependencies: dynamic): List<DependencyConfiguration> {
        return toDependencyConfigurations(dependencies)
    }

    private fun toDependencyConfigurations(dependencies: dynamic): List<DependencyConfiguration> {
        if (!dependencies) {
            return emptyList()
        }
        return (dependencies as Array<dynamic>).map {
            DependencyConfiguration(
                    artifactId = ArtifactId(it.name, it.group, it.version),
                    structural = it.structural,
                    test = it.test
            )
        }
    }

    private fun getDiscoverJsonObjects(root: String): Map<String, dynamic> {
        val paths = glob.sync("${root}/**/$DISCOVER_JSON", null)
        val structuresByPath = paths.associateBy({ resolve(dirname(it)) }, { parseJson(it) })
        return structuresByPath
    }

    private fun parseJson(fileName: String) = JSON.parse<dynamic>(readFileSync(fileName, "utf-8"))

}