module.exports = {
    /* Your site config here */
    plugins: [
      `gatsby-plugin-styled-components`,
      `gatsby-plugin-react-helmet`,
      {
        resolve: `gatsby-plugin-manifest`,
        options: {
          name: `GPT3-Chatbot`,
          short_name: `Chatbot`,
          start_url: `/`,
          background_color: `#ffffff`,
          theme_color: `#1e90ff`,
          display: `standalone`,
          icon: `src/images/icon.png`
        }
      },
      `gatsby-plugin-offline`
    ]
  };
  