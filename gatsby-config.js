module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "frontend",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    'gatsby-plugin-fontawesome-css',
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
  ],
};
