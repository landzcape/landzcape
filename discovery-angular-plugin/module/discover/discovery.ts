const landscape = require('../discover/domain/landzcape-domain');

export function discoverAngularLandzcape(tsConfigPath: string): void {
    const discovery = new landscape.AngularDiscovery();
    discovery.discover(tsConfigPath);
}