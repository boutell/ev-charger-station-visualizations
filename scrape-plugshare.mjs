import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const authorization = 'Basic d2ViX3YyOkVOanNuUE54NHhXeHVkODU=';

let sitemaps = (await get('/robots.txt'))
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .filter(line => line.startsWith('Sitemap:'))
  .map(line => line.match(/https[\S]+/)[0]);

const parsedSitemaps = new Map();

let unparsed;
do {
  unparsed = false;
  let newSitemaps = [];
  for (const sitemap of sitemaps) {
    if (!parsedSitemaps.get(sitemap)) {
      unparsed = true;
      let data = await parse(await get(sitemap));
      parsedSitemaps.set(sitemap, data);
      let sitemaps = data?.sitemapindex?.sitemap;
      if (sitemaps && !Array.isArray(sitemaps)) {
        sitemaps = [ sitemaps ];
      }
      if (sitemaps) {
        newSitemaps = [...newSitemaps, ...sitemaps.map(entry => entry.loc) ];
      }
    }
  }
  sitemaps = [...sitemaps, ...newSitemaps];
} while (unparsed);

let locations = [];

for (const sitemap of sitemaps) {
  const data = parsedSitemaps.get(sitemap);
  locations = [...locations, ...(data?.urlset?.url || []).map(url => url.loc).filter(url => url.includes('/location'))];
}

for (const location of locations) {
  console.log(location);
  const n = location.match(/\/location\/(\d+)/)[1];
  const apiUrl = `https://api.plugshare.com/v3/locations/${n}`;
  console.log(apiUrl);
  const data = await get(apiUrl, {
    headers: {
      'Authorization': authorization,
      'Cognito-Authorization': 'eyJraWQiOiJ4RmIzSVZuTXhYZEhUaWNTN1NJeVNGc3BHOUsydVZ2NUVNT2U4NkQxeHhBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSlFyX0hrUFNwQ3hJVTZHZ3FzbmJRZyIsInN1YiI6ImM4M2M1N2Q3LTdjNDgtNGUzNC1iMDYwLWI5YTNhM2U4ZGIyNyIsImN1c3RvbTpwbHVnc2hhcmVfaWQiOiIyMDg0NDAzIiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX293ZVE3WG1HZl9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX293ZVE3WG1HZiIsImNvZ25pdG86dXNlcm5hbWUiOiJnb29nbGVfMTEyODQxNjU3NTEzODU2NTYyODg4IiwiZ2l2ZW5fbmFtZSI6IlRvbSIsInBpY3R1cmUiOiJodHRwczpcL1wvbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbVwvYS1cL0FPaDE0R2hzQVhxNy1EOVh6ZEswUzN1bXM5ZUQwdHk5TzdCY3RZWjRITGpWNEFZPXM5Ni1jIiwiYXVkIjoiMnUwcWkzcjBla2MzaG5zbDJyc2czMTFjaSIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjExMjg0MTY1NzUxMzg1NjU2Mjg4OCIsInByb3ZpZGVyTmFtZSI6Ikdvb2dsZSIsInByb3ZpZGVyVHlwZSI6Ikdvb2dsZSIsImlzc3VlciI6bnVsbCwicHJpbWFyeSI6InRydWUiLCJkYXRlQ3JlYXRlZCI6IjE2NDQwODMyNzE2NzQifV0sInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ0MTg5MDA0LCJuYW1lIjoiVG9tIEJvdXRlbGwiLCJleHAiOjE2NTY4Njg4OTQsImlhdCI6MTY1Njg2NTI5NCwiZW1haWwiOiJ0b21teWJnb29kZUBnbWFpbC5jb20ifQ.tjpbNkt9Um8J6YXPnzGNoK03WHd99GiEqT16zOZkBqo6OgmeNTRMtsvSCt3MRrxRMi7-kucrpHNq97ogCrqb48XleALMo1L7kqoyxpZ_cAWIHe8_P0GWWYJdh4flCOFJL7IBlD38aSNnQ-XalhW4-SX3s6DYx4ekIEFnOzIb1qqALVifr2ifSUhUkx6tImfaW4osTw0-ZEYT4TYR_-2r4U_pOsNp6_c0ei0JVW5-wJBNsM-Rq4_FOmTW0_aDyP3tL0fss-CVjJtTdn-tArqEQaJmAzOGJLI3FuIYb5D89CLwrul550NXnQlXkS0LMURobDAZZGoUDe97Nn5rDeAG3g',
      'Referer': location,
      'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    }
  });
  console.log(data);
}

async function get(url, options = {}) {
  await pause(250);
  if (url.startsWith('/')) {
    url = `https://plugshare.com${url}`;
  }
  const response = await fetch(url, options);
  if (response.status >= 400) {
    throw response;
  }
  return response.text();
}

function pause(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

function parse(xml) {
  const parser = new XMLParser();
  return parser.parse(xml);
}