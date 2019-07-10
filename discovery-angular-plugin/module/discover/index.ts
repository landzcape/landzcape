#!/usr/bin/env node
import {discoverAngularLandzcape} from "./discovery";
import * as commander from "commander";

commander
    .arguments("[tsconfig]")
    .action((tsConfigPath: string) => {
        const path = tsConfigPath ? tsConfigPath : 'tsconfig.json';
        console.log(`Landzcape Discovery for Angular - Start using ${path}`);
        discoverAngularLandzcape(path);
        console.log('Landzcape Discovery for Angular - Finished');
    })
    .parse(process.argv);

