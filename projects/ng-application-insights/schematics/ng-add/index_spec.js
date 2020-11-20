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
const testing_1 = require("@angular-devkit/schematics/testing");
const path = require("path");
const collectionPath = path.join(__dirname, "../collection.json");
const runner = new testing_1.SchematicTestRunner("schematics", collectionPath);
describe('ng-application-insights-schematic', () => {
    let appTree;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Run ng g workspace schematic
        appTree = yield runner
            .runExternalSchematicAsync("@schematics/angular", "workspace", { name: "test", version: "10.0.5" }, appTree)
            .toPromise();
        // Run ng g application schematic
        appTree = yield runner
            .runExternalSchematicAsync("@schematics/angular", "application", { name: "my-app", style: 'scss' }, appTree)
            .toPromise();
    }));
    it('works', () => __awaiter(void 0, void 0, void 0, function* () {
        const tree = yield runner.runSchematicAsync("ng-add", {}, appTree).toPromise();
        const appModules = tree.read('/my-app/src/app/app.module.ts').toString();
        expect(appModules).toContain(`import {
  NgApplicationInsightsModule,
  NgApplicationInsightsErrorHandler,
} from '@wizsolucoes/ng-application-insights';`);
        expect(appModules).toContain(`NgApplicationInsightsModule.forRoot({
      enabled: true,
      instrumentationKey: '',
    })`);
        expect(appModules).toContain(`[{ provide: ErrorHandler, useClass: NgApplicationInsightsErrorHandler }],`);
    }));
});
//# sourceMappingURL=index_spec.js.map