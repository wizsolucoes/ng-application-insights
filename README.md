# Wiz NgApplicationInsights

Adicione o Microsoft Application Insights à sua aplicação com apenas um comando. 


## Sobre
Este schematic irá instalar o pacote `@wizsolucoes/ng-application-insights`, bem como suas dependências de pares e modificar o arquivo `app.module.ts` para usar o pacote.

## Uso
Basta executar o schematic na raiz do seu projeto Angular:
```bash
ng add @wizsolucoes/ng-application-insights
```

### Configuração
Após a finalização da execução do schematic, deve-se customizar o objeto de configuração no módulo que foi importado pelo schematic em `app.module.ts`. Exemplo:

```typescript
@NgModule({
  // ...
  imports: [
    NgApplicationInsightsModule.forRoot({
      // Booleano para hablitar Application Insights.
      // Típicamente "false" em ambientes de desenvolvimento e "true" em ambientes de produção.
      // Sugestão: environment.production
      enabled: environment.production,

      // String que corresponda à chave de instrumentação da Application Insights.
      instrumentationKey: 'sua-chave-aqui',
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
