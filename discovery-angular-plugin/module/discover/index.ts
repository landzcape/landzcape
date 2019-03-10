export function discover(tsConfigPath: string): void {
    const landscape = require('landscape');
    const discovery = new landscape.AngularDiscovery();
    discovery.discover(tsConfigPath);
}