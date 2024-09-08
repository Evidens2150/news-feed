import axios from 'axios';
import { parse } from 'url';

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;

  let url = 'http://static.feed.rbc.ru/rbc/logical/footer/news.rss';

  const { query } = parse(req.url);  
  if (!!query) {    
    url = `https://www.rbc.ru/${query}`
  }
  
  try {
      const response = await axios.get(url);

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/html');

      return response.data;   
  } catch (error) {
    console.error('Error fetching news:', error);
    res.statusCode = 500;
    return { error: 'Error fetching news' };
  }
});