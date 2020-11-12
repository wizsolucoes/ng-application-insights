"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ts = require("typescript");
const fs_1 = require("fs");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const schematics_1 = require("@angular-devkit/schematics");
const change_1 = require("@schematics/angular/utility/change");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function main(_options) {
    return (tree, _context) => {
        return schematics_1.chain([
            fetchAppInsights(),
            installAppInsights(),
            fixImports(),
        ])(tree, _context);
    };
}
exports.main = main;
function fetchAppInsights() {
    return (tree, _context) => {
        if (tree.exists('package.json')) {
            const appInsights = {
                name: '@microsoft/applicationinsights-web',
                type: dependencies_1.NodeDependencyType.Default,
                version: '^2.5.9',
            };
            dependencies_1.addPackageJsonDependency(tree, appInsights);
            _context.addTask(new tasks_1.NodePackageInstallTask());
        }
        return tree;
    };
}
function installAppInsights() {
    return (tree, _context) => {
        const filePath = './src/app/app.module.ts';
        const source = ts.createSourceFile(filePath, fs_1.readFileSync(filePath, { encoding: 'utf-8' }), ts.ScriptTarget.Latest, true);
        const updateRecorder = tree.beginUpdate(filePath);
        const insertErrorHandlerChange = ast_utils_1.insertImport(source, filePath, 'ErrorHandler', '@angular/core', false);
        const importChanges = ast_utils_1.addImportToModule(source, filePath, `NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    })`, '@wizsolucoes/ng-application-insights');
        const providerChanges = ast_utils_1.addProviderToModule(source, filePath, '{ provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }', '@wizsolucoes/ng-application-insights');
        if (insertErrorHandlerChange instanceof change_1.InsertChange) {
            updateRecorder.insertRight(insertErrorHandlerChange.pos, insertErrorHandlerChange.toAdd);
        }
        for (const change of importChanges) {
            if (change instanceof change_1.InsertChange) {
                updateRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        for (const change of providerChanges) {
            if (change instanceof change_1.InsertChange) {
                updateRecorder.insertLeft(change.pos, change.toAdd);
            }
        }
        tree.commitUpdate(updateRecorder);
        return tree;
    };
}
function fixImports() {
    return (tree, _context) => {
        var _a;
        const filePath = './src/app/app.module.ts';
        const code = (_a = tree.read(filePath)) === null || _a === void 0 ? void 0 : _a.toString('utf-8');
        if (code) {
            let newCode = code.replace(`import { NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    }) } from '@wizsolucoes/ng-application-insights';`, '');
            newCode = newCode.replace("import { { provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler } } from '@wizsolucoes/ng-application-insights';", `import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';`);
            tree.overwrite(filePath, newCode);
        }
        return tree;
    };
}
//# sourceMappingURL=index.js.map