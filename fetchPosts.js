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
const readmeHeader =`### Hello world! 👋\n
I'm Furkan, a passionate frontend developer interested in React. \n
In the fast-paced world of frontend development, I'm always seeking new opportunities to enhance my skills.\n
![elbaley's GitHub stats](https://github-readme-streak-stats.herokuapp.com/?user=elbaley&theme=dark)
\n
### Reach Me:\n
<a href="https://www.linkedin.com/in/furkan-leba-24ba1227a/">
<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/> 
</a>
<a href="mailto:lebafurkan@outlook.com">
<img style="height:28px" src="https://camo.githubusercontent.com/0f3aa1f457bb92fbd2411761262ce1fb0f766ed74a4f4289bfc4a0b6024335d6/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f656d61696c2e737667"/> 
</a>`

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
