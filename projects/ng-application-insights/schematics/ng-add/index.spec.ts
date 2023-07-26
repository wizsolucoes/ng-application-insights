// import {
//   SchematicTestRunner,
//   UnitTestTree,
// } from '@angular-devkit/schematics/testing';
// import * as path from 'path';

// const collectionPath = path.join(__dirname, "../collection.json");
// const runner = new SchematicTestRunner("schematics", collectionPath);

describe('ng-application-insights-schematic', () => {
  // let appTree: UnitTestTree;

  beforeAll(async () => {
    // Run ng g workspace schematic
    // appTree = await runner
    //   .runExternalSchematicAsync(
    //     "@schematics/angular",
    //     "workspace",
    //     { name: "test", version: "10.0.5" },
    //     appTree
    //   )
    //   .toPromise();

    // Run ng g application schematic
    //   appTree = await runner
    //     .runExternalSchematicAsync(
    //       "@schematics/angular",
    //       "application",
    //       { name: "my-app", style: 'scss' },
    //       appTree
    //     )
    //     .toPromise();
    // });

    //   it('works', async () => {
    //     const tree = await runner.runSchematicAsync(
    //       "ng-add",
    //       {},
    //       appTree
    //     ).toPromise();

    //     const appModules = tree.read('/my-app/src/app/app.module.ts')!.toString();

    //     expect(appModules).toContain(
    //       `import {
    //   NgApplicationInsightsModule,
    //   NgApplicationInsightsErrorHandler,
    // } from '@wizsolucoes/ng-application-insights';`
    //     );

    //     expect(appModules).toContain(
    //       `NgApplicationInsightsModule.forRoot({
    //       enabled: true,
    //       instrumentationKey: '',
    //       properties: {}, // Propriedade opcional. Pode ser removida, caso não seja necessária.
    //     })`
    //     );

    //     expect(appModules).toContain(
    //       `[{ provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }],`
    //     )
  });
});
