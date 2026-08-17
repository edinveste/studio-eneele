module.exports = function(eleventyConfig) {
  // Passa os arquivos estáticos para o diretório de build (_site)
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("*.jpg");
  eleventyConfig.addPassthroughCopy("*.mp4");
  
  // Passa a pasta admin do Decap CMS
  eleventyConfig.addPassthroughCopy("admin");

  return {
    dir: {
      input: ".",
      output: "_site",
      data: "_data"
    }
  };
};
