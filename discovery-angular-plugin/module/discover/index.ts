export function discover(tsConfigPath: string): void {
    const landscape = require('./domain/landzcape-domain');
    const discovery = new landscape.AngularDiscovery();
    discovery.discover(tsConfigPath);
}