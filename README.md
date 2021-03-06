
# Landzcape
[![CircleCI](https://circleci.com/gh/landzcape/landzcape.svg?style=svg)](https://circleci.com/gh/landzcape/landzcape)

Landzcape visualizes components and their dependencies. This structure can be discovered using
plugins for Angular, Gradle and/or Maven.  

**Available plugin tasks**

| Task           | Gradle | Maven | Angular |
| -------------- |:------:|:-----:|:-------:|
| Discover       | Yes    | Yes   | Yes     |
| Merge          | Yes    | Yes   | No      |
| ExtractExplorer| Yes    | Yes   | No      |


## Discovery
In essence the `discovery` process will scan your code, extract the module structure and write it to a file named `landscape.json`.
The generated `landscape.json` will be the source for visualizing your module landscape.    

### Discovery with Maven

The discovery plugin needs to be run in the root `pom.xml` of your multi-module maven project.

```
<build>
    <plugins>
        <plugin>
            <groupId>io.landzcape</groupId>
            <artifactId>discovery-maven-plugin</artifactId>
            <version>1.0</version>
            <inherited>false</inherited>
            <executions>
                <execution>
                    <phase>process-resources</phase>
                    <goals>
                        <goal>discover</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <context>surfshop</context>
                <domain>surfing</domain>
                <includes>
                    <include>com.surfshop::</include>
                </includes>
                <excludes>
                    <exclude>com.surfshop:excluded-module:</exclude>
                </excludes>
                <contexts>
                    <context>
                        <name>surfshop</name>
                        <label>My Surfshop!</label>
                    </context>
                </contexts>
                <domains>
                    <domain>
                        <name>surfing</name>
                        <label>Surfing</label>
                        <context>surfshop</context>
                    </domain>
                </domains>
                <layers>
                    <layer>
                        <name>es</name>
                        <label>Edge Service</label>
                        <matching>*-es</matching>
                        <order>1</order>
                    </layer>
                    <layer>
                        <name>cs</name>
                        <label>Core Service</label>
                        <matching>*-cs</matching>
                        <order>2</order>
                    </layer>
                </layers>
            </configuration>
        </plugin>
    </plugins>
</build>
```

The plugin's configuration can be overridden in sub-projects. Example:

```
<build>
    <plugins>
        <plugin>
            <groupId>io.landzcape</groupId>
            <artifactId>discovery-maven-plugin</artifactId>
            <version>1.0</version>
            <inherited>false</inherited>
            <configuration>
                <type>common</type>
            </configuration>
        </plugin>
    </plugins>
</build>
```

If you want to skip the discovery process conditionally, use `<skipDiscovery>true</skipDiscoveryskipDiscovery>`.

### Discovery with Gradle

The discovery plugin needs to be configured in the root `build.gradle` of your multi-module gradle project.
Just import the plugin ... 
```
buildscript {
    repositories { ...  }

    dependencies {
        classpath 'io.landzcape:discovery-gradle-plugin:1.0'
    }
}

apply plugin: 'io.landzcape.discovery'
```

... and configure it to your needs ...

```
landscape {
    context = 'surfshop'
    domain = 'surfing'
    includes = ['com.surfshop::']
    excludes = ['com.surfshop:excluded-module:']

    contexts {
        context name: 'surfshop', label: 'My Surfshop!'
        context name: 'kiteshop', label: 'My Kiteshop'
    }

    domains {
        domain name: 'surfing', label: 'Surfing', context: 'surfshop'
    }

    layers {
        layer name: 'es', label: 'Edge Service', matching: '*-es', order: 1
        layer name: 'cs', label: 'Core Service', matching: '*-cs', order: 2
    }
}
```
The plugin's configuration can be overridden in sub-projects.

Execute the `discover` task to run start the discovery process. 

### Discovery with Angular

In your `package.json` add ...

```
"devDependencies": {
    "@landzcape/discovery-angular": "1.0.0",
    ...
}
```
... to import the dependency. The configuration goes into files named `discover.json`.
As an example, you could have a `discover.json` in your root directory (next to `tsconfig.json`) that defines your layers ...

```
{
  "context": "surfshop",
  "domain": "surfing",
  "layer": "ui"
}
```

... and a separate `discover.json` in your `shared` folder to mark all your shared modules with the type `COMMON`.

```
{
  "type": "COMMON"
}
```

To start the discovery, invoke this command using a terminal or npm build script:

```landzcape-discovery-angular```

As an optional argument you can specify the location of the projects `tsconfig.json`.

## Merging

Already discovered `landscape.json` files can be merged for visualization.

### Merging with Maven

```
<build>
    <plugins>
        <plugin>
            <groupId>io.landzcape</groupId>
            <artifactId>discovery-maven-plugin</artifactId>
            <version>1.0</version>
            <inherited>false</inherited>
            <executions>
                <execution>
                    <phase>process-resources</phase>
                    <goals>
                        <goal>merge</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <discoveries>
                    <discovery>first/landscape.json</discovery>
                    <discovery>second/landscape.json</discovery>
                </discoveries>
                <mergeTo>landscape.json</mergeTo>
            </configuration>
        </plugin>
    </plugins>
</build>
```

If you want to skip the merge conditionally, use `<skipMerge>true</skipMerge>`.

### Merging with Gradle

```
import io.landzcape.gradle.MergeTask

...

apply plugin: 'io.landzcape.discovery'

task merge(type: MergeTask) {
    discoveries = ['first/landscape.json', 'second/landscape.json']
    mergeTo = 'landscape.json'
}
```
## Visualization

Landzcape Explorer is a web application that visualizes your landscape.
It is bundled with the Gradle and Maven discovery plugin. It can be extracted
during the build process and deployed with any HTTP server.

### Example using `nginx`
Assuming that you already discovered your landscape and your `landscape.json` is ready.
#### 1. Extract the visualization application
You can either use Maven to extract the visualization application ...
```
<build>
    <plugins>
        <plugin>
            <groupId>io.landzcape</groupId>
            <artifactId>discovery-maven-plugin</artifactId>
            <version>1.0</version>
            <inherited>false</inherited>
            <executions>
                <execution>
                    <phase>process-resources</phase>
                    <goals>
                        <goal>extractExplorer</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <extractTo>explorer</extractTo>
            </configuration>
        </plugin>
    </plugins>
</build>
```
... or do the same with gradle ...
```
import io.landzcape.gradle.ExtractExplorerTask

...

apply plugin: 'io.landzcape.discovery'

task extract(type: ExtractExplorerTask) {
    extractTo = 'explorer'
}
```

If you want to skip the extraction conditionally, use `<skipExtraction>true</skipExtraction>`.

#### 2. Bundle application and landscape with `nginx` 

```
FROM nginx
COPY explorer /usr/share/nginx/html
COPY landscape.json /usr/share/nginx/html
```

#### 3. Build, deploy and run ...
... the docker image. Preferably all automated, so you always have an updated architecture visualization :)


