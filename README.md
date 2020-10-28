# Wiz NgApplicationInsights

Adicione o Microsoft Application Insights ao seu comando com apenas um comando.

## Instalação e Configuração

Para adicionar o Application Insights ao projeto, basta executar o comando:

```bash
ng add @wizsolucoes/ng-application-insights
```

Após a instalação dos pacotes e finalização da execução do Schematics, deve-se criar um objeto de configuração. Exemplo:

```typescript
const ngApplicationInsightsConfig = {
  enabled: true,
  appInsightsConfig: {
    instrumentationKey: 'YOUR-APPLICATION-INSIGHTS-INSTRUMENTATION-KEY',
  }
}
```

Por fim, com o objeto de configuração criado, deve-se adicionar as configurações a declaração do modulo no arquivo 'app.module.ts' do projeto:

```typescript
/* app.module.ts */
import OBJETO_DE_CONFIGURACAO from 'path_para_objeto_configuracao';

// ...

@NgModule({
  // ...
  imports: [
    NgApplicationInsightsModule.forRoot({
      enabled: OBJETO_DE_COFIGURACAO.enabled,
      instrumentationKey: OBJETO_DE_CONFIGURACAO.appInsightsConfig.instrumentationKey,
    }),
  ],
```

## Desenvolvimento, por onde começar

```bash
# Instalar dependências
npm install

cd projects/ng-application-insights

npm install

cd schematics

npm install

cd ../../../

# Build Lib + Schematics
npm run build

# Executar os testes
npm test
```

### Testando Lib + Schematics localmente

1. Gere um distribuível da lib e do schematics

```bash
# Instalar dependências
npm install

cd projects/ng-application-insights

npm install

cd schematics

npm install

cd ../../../

# Build Lib + Schematics
npm run build

# Gerar tarball e.g. wizsolucoes-ng-application-insights-1.0.0.tgz
cd dist/

npm pack
```

2. Instale e execute o schematic na raiz de qualquer aplicação
```bash
# Instalar lib + schematics
npm i --no-save ../path/to/ng-application-insights/wizsolucoes-ng-application-insights-1.0.0.tgz

# Executar o schematic
ng g @wizsolucoes/ng-application-insights:ng-add
```
