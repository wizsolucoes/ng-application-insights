import * as ts from 'typescript';
import { readFileSync } from 'fs';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { InsertChange } from '@schematics/angular/utility/change';
import {
  addImportToModule,
  addProviderToModule,
  insertImport,
} from '@schematics/angular/utility/ast-utils';
import {
  NodeDependency,
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function main(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      fetchAppInsights(),
      installAppInsights(),
      fixImports(),
    ])(tree, _context);
  };
}

function fetchAppInsights() {
  return (tree: Tree, _context: SchematicContext) => {
    if (tree.exists('package.json')) {
      const appInsights: NodeDependency = {
        name: '@microsoft/applicationinsights-web',
        type: NodeDependencyType.Default,
        version: '^2.5.9',
      };

      addPackageJsonDependency(tree, appInsights);

      console.log(tree.read('package.json')?.toString('utf-8'));

      _context.addTask(new NodePackageInstallTask());
    }

    return tree;
  }
}

function installAppInsights() {
  return (tree: Tree, _context: SchematicContext) => {
    const filePath = './src/app/app.module.ts';

    const source = ts.createSourceFile(
      filePath,
      readFileSync(filePath, { encoding: 'utf-8' }),
      ts.ScriptTarget.Latest,
      true,
    );

    const updateRecorder = tree.beginUpdate(filePath);

    const insertErrorHandlerChange = insertImport(
      source,
      filePath,
      'ErrorHandler',
      '@angular/core',
      false
    );

    const importChanges = addImportToModule(
      source,
      filePath,
      `NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    })`,
      '@wizsolucoes/ng-application-insights',
    ) as InsertChange[];

    const providerChanges = addProviderToModule(
      source,
      filePath,
      '{ provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }',
      '@wizsolucoes/ng-application-insights',
    ) as InsertChange[];

    if (insertErrorHandlerChange instanceof InsertChange) {
      updateRecorder.insertRight(
        insertErrorHandlerChange.pos,
        insertErrorHandlerChange.toAdd
      );
    }

    for (const change of importChanges) {
      if (change instanceof InsertChange) {
        updateRecorder.insertLeft(change.pos, change.toAdd);
      }
    }

    for (const change of providerChanges) {
      if (change instanceof InsertChange) {
        updateRecorder.insertLeft(change.pos, change.toAdd);
      }
    }

    tree.commitUpdate(updateRecorder);

    return tree;
  }
}

function fixImports() {
  return (tree: Tree, _context: SchematicContext) => {
    const filePath = './src/app/app.module.ts';

    const code = tree.read(filePath)?.toString('utf-8');

    if (code) {
      let newCode = code.replace(
        `import { NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    }) } from '@wizsolucoes/ng-application-insights';`,
        '',
      );

      newCode = newCode.replace(
        "import { { provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler } } from '@wizsolucoes/ng-application-insights';",
        `import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';`,
      );

      tree.overwrite(filePath, newCode);
    }

    return tree;
  }
}