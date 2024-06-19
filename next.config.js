const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const nextConfig = {
  reactStrictMode: false,

  webpack(config, { isServer }) {
    config.plugins.push(
        new NextFederationPlugin({
          name: 'programs',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './UserProgramsSurface': 'src/components/UserProgramsSurface.tsx',
            './FavoriteProgramsSurface': 'src/components/FavoriteProgramsSurface.tsx',
            './ProgramSurface': 'src/components/ProgramSurface.tsx',
            './ReviewSurface': 'src/components/reviews/ReviewSurface.tsx',
            './ExerciseSurface': 'src/components/exercises/ExerciseSurface.tsx',
            './ProgramCardSmall': 'src/components/ProgramCardSmall.tsx',
            './SearchPrograms': 'src/components/SearchPrograms.tsx',
          },
          shared: {},
        })
    );
    config.devServer = {
      client: { overlay: { warnings: false } }
    }

    return config;
  },

  /*webpack: function (config, _) {
      config.devServer = {
          client: { overlay: { warnings: false } }
      }
      return config
  }*/
}

module.exports = nextConfig
