# Mackeys Configurator

Este projeto é um programa para Linux (Gnome e Cinnamon) que permite ajustar o layout de teclados estilo Apple, como o Logitech K380s, K380, K780, Keychron, entre outros. Ele facilita a personalização das teclas para melhor compatibilidade e usabilidade nesses ambientes.

## Como clonar e rodar o projeto

1. **Clone o repositório:**

```
git clone https://github.com/carlosxfelipe/mackeys-configurator.git
cd mackeys-configurator
```

2. **Instale as dependências:**

```
npm install
```

3. **Inicie o ambiente de desenvolvimento:**

```
npm run dev
```

O projeto estará disponível para desenvolvimento local.

## Screenshot

![Tela principal do Mackeys Configurator](assets/screenshot-main.png)

## Como gerar AppImage

Para criar o AppImage do Mackeys Configurator:

1. Certifique-se de que as dependências estejam instaladas:

   ```bash
   npm install
   ```

2. Execute o comando de build para AppImage:

   ```bash
   npm run build:appimage
   ```

O arquivo AppImage será gerado na raiz do projeto com o nome `MacKeys-Configurator-x86_64.AppImage`.

Se necessário, o script irá baixar o `appimagetool` automaticamente.

### Scripts disponíveis

Além do AppImage, você pode usar outros scripts de build disponíveis em `package.json`:

- `npm run build:sea` — Gera o executável nativo (SEA)
- `npm run build:flatpak` — Gera e instala o Flatpak localmente (requer `flatpak-builder`)

Sinta-se à vontade para abrir issues ou contribuir!
