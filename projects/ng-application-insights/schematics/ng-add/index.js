"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const ts = require("typescript");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const schematics_1 = require("@angular-devkit/schematics");
const change_1 = require("@schematics/angular/utility/change");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const dependencies_1 = require("@schematics/angular/utility/dependencies");
const workspace_1 = require("@schematics/angular/utility/workspace");
let defaultPath;
// You don't have to export the function as default. You can also have more than one rule factory
// per file.
function main(_options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        const workspaceConfigBuffer = tree.read("angular.json");
        if (!workspaceConfigBuffer)
            throw new schematics_1.SchematicsException("Not an Angular CLI workspace");
        const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
        const projectName = _options.project || workspaceConfig.defaultProject;
        defaultPath = yield workspace_1.createDefaultPath(tree, projectName);
        return schematics_1.chain([
            fetchAppInsights(),
            installAppInsights(),
            fixImports(),
        ]);
    });
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
        const filePath = `${defaultPath.concat('/app.module.ts')}`;
        const source = ts.createSourceFile(filePath, tree.read(filePath).toString('utf-8'), ts.ScriptTarget.Latest, true);
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
        const filePath = `${defaultPath.concat('/app.module.ts')}`;
        const code = (_a = tree.read(filePath)) === null || _a === void 0 ? void 0 : _a.toString('utf-8');
        if (code) {
            let newCode = code.replace(`import { NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    }) } from '@wizsolucoes/ng-application-insights';`, '').replace("import { { provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler } } from '@wizsolucoes/ng-application-insights';", `import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';`);
            tree.overwrite(filePath, newCode);
        }
        return tree;
    };
}
//# sourceMappingURL=index.js.map