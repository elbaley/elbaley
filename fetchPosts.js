const fs = require("fs");
const Mustache = require("mustache");
const Parser = require("rss-parser");

// Fetch posts from RSS
const parser = new Parser();
const url = "https://furkanleba.com/index.xml";
const fetchPosts = async (url) => {
  const feed = await parser.parseURL(url);

  const latestPosts = feed.items
    .slice(0, 6)
    .filter((item) => item.link !== "/hakkimda/");

  const formattedPosts = latestPosts.map((post) => {
    return { title: post.title, link: `https://furkanleba.com${post.link}` };
  });
  return formattedPosts;
};

// Add latest posts to Readme file
/**
 *  Use Mustache to render the readme with the data
 */
const MUSTACHE_MAIN_DIR = "./main.mustache";
const readmeHeader = `### Hello world! 👋\n
I'm Furkan, a frontend developer based in Istanbul. \n
![elbaley's GitHub stats](https://github-readme-streak-stats.herokuapp.com/?user=elbaley&theme=dark)
\n
### Reach Me:\n
<a href="https://www.linkedin.com/in/furkan-leba-24ba1227a/">
<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/> 
</a>
<a href="mailto:lebafurkan@outlook.com">
<img style="height:28px" src="https://img.shields.io/badge/mail-0f3464?style=for-the-badge&logo=microsoftoutlook"/> 
</a>\n
### Latest posts\n
`;

async function generateReadMe() {
  const DATA = {
    posts: await fetchPosts(url),
  };
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = readmeHeader + Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}
generateReadMe();
