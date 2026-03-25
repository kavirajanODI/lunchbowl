module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          assets: './src/assets',
          components: './src/components',
          screens: './src/screens',
          styles: './src/styles',
          services: './src/services',
          api: './src/api',
          utils: './src/utils',
          context: './src/context',
          hooks: './src/hooks',
          types: './src/types',
          models: './src/models',
          config: './src/config',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
